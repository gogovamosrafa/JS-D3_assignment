
const parseNA = string => (string === 'NA' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

function type(d){
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget,
        genre: parseNA(d.genre),
        // 把字串丟到JSON.parse,轉換成物件
        //map:進去每一個房間取資料，這裡只取map
        genres: JSON.parse(d.genres).map(d=>d.name),
        homepage: parseNA(d.homepage),
        id: +d.id,
        imdb_id: +d.imdb_id,
        original_language: parseNA(d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity,
        poster_path: parseNA(d.poster_path),
        production_countries: JSON.parse(d.production_countries).map(d=>d.name),
        release_date: date,
        release_year:date.getFullYear(),
        revenue: +d.revenue,
        runtime: +d.runtime,
        status: parseNA(d.status),
        tagline: parseNA(d.tagline),
        title: parseNA(d.title),
        vote_average: +d.vote_average,
        vote_count: +d.vote_count
    }
}

function filterData(data){
    return data.filter(
    d => {
        return(
            d.release_year > 1999 && d.release_year < 2010 &&
            d.revenue > 0 &&
            d.budget > 0 &&
            d.genre &&
            d.title
        );
    }
    );
}

function prepareBarChartData(data){
    // console.log(data);
    const dataMap = d3.rollup(
        data,
        v => d3.sum(v, leaf => leaf.revenue), //每一筆資料leaf進來後，將revenue加總起來 
        d => d.genre //依照電影分類捲起來
    );
    const dataArray = Array.from(dataMap, d=>({genre:d[0],revenue:d[1]})); //Array每一個object,把[0][1]分別作為genre and revenue
    return dataArray;
}

//Draw
function setupCanvas(barChartData){
    const svg_width = 400;
    const svg_height = 500;
    const chart_margin = {top:80,right:40,buttom:40,left:80};
    const chart_width = svg_width - (chart_margin.top + chart_margin.buttom);
    const chart_height = svg_height - (chart_margin.top + chart_margin.buttom);

    const this_svg = d3.select('.bar-chart-container').append('svg')
                       .attr('width', svg_width)
                       .attr('height', svg_height)
                       .append('g')
                       .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`)

    //scale 
    const xExtent = d3.extent(barChartData,d=>d.revenue);
    const xScale_v1 = d3.scaleLinear().domain(xExtent).range([0,chart_width]);
    
    const xMax = d3.max(barChartData, d=>d.revenue);
    const xScale_v2 = d3.scaleLinear().domain([0, xMax]).range([0, chart_width]);

    const xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);

    // 垂直空間分配
    const yScale = d3.scaleBand().domain(barChartData.map(d=>d.genre))
                     .rangeRound([0, chart_height])
                     .paddingInner(0.25);


    // Draws Bars
    const bars = this_svg.selectAll('.bar')
                         .data(barChartData)
                         .enter()
                         .append('rect')
                         .attr('class','bar')
                         .attr('x',0)
                         .attr('y',d=>yScale(d.genre))
                         .attr('width',d=>xScale_v3(d.revenue))
                         .attr('height',yScale.bandwidth())
                         .style('fill','#f00')

    // Draw header
    const header = this_svg.append('g')
                           .attr('class','bar-header')
                           .attr('transform',`translate(0,${-chart_margin.top/2})`)
                           .append('text');
    header.append('tspan').text('Total revenue by genre in $US')
    header.append('tspan').text('Year:2000-2009')
          .attr('x',0)
          .attr('y',20)
          .style('font-size','0.8em')
          .style('fill','#555')


    const xAxis = d3.axisTop(xScale_v3).tickFormat(formatTicks)
          .tickSizeInner(-chart_height)
          .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickSize(0);
    const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);

yAxisDraw.selectAll('text').attr('dx','-0.6em');
    
}

//刻度顯示格式轉換
function formatTicks(d){
    return d3.format('~s')(d)
    .replace('M','mil')
    .replace('G','bil')
    .replace('T','tri')
}

//Main
function ready(movies){
    const moviesClean = filterData(movies); //被movie帶進去 //呼叫filterData
    // console.log(moviesClean);
    const barChartData = prepareBarChartData(moviesClean).sort(
        (a,b)=>{
            return d3.descending(a.revenue, b.revenue); //有多到少排序revenue
        }
    );
    console.log(barChartData); //目前只剩下genre跟revenue的加總 
    // debugger;
    setupCanvas(barChartData); //將畫圖的語法獨立於setupCanvas
}

//load data
//將上面寫好的type function 存取進來
d3.csv('data/movies.csv',type).then(
    res => {
        ready(res)
        // console.log(res);
    }
);