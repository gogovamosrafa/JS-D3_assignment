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

function formatTicks(d){
    return d3.format('~s')(d)
    .replace('M','mil')
    .replace('G','bil')
    .replace('T','tri')
}




function prepareScatterData(data){
    return data.sort((a,b)=>b.budget-a.budget)
               .filter((d,i)=>i<100);
}

function addLabel(axis, label, x, y){
    //axis 為呼叫者
    axis.selectAll('.tick:last-of-type text')
    .clone()
    .text(label)
    .attr('x',x).attr('y',y)
    .style('text-anchor','start')
    .style('font-weight','bold')
    .style('fill','coral') 
}
function setupCanvas(scatterData){
    const svg_width = 500;
    const svg_height = 500;
    const chart_margin = {top:80,right:40,buttom:40,left:80};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.buttom);

    const this_svg = d3.select('.scatter-plot-container')
                       .append('svg')
                       .attr('width',svg_width).attr('height',svg_height)
                       .append('g')
                       .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);

    const xExtent = d3.extent(scatterData, d=>d.budget);
    
    const xScale_v1 = d3.scaleLinear().domain(xExtent).range([0,chart_width]);

    const yExtent = d3.extent(scatterData, d=>d.revenue);
    const yScale = d3.scaleLinear().domain(yExtent).range([chart_width,0]);

    //出現/更新/消失
    const bars = this_svg.selectAll('.scatter')
                 .data(scatterData)
                 .enter()
                 .append('circle')
                 .attr('class','scatter')
                 .attr('cx',d=>xScale_v1(d.budget))
                 .attr('cy',d=>yScale(d.revenue))
                 .attr('r',3)
                 .style('fill','#f00')
                 .style('fill-opacity',0.5);

    //Draw header
    const header = this_svg.append('g').attr('class','bar-header')
                   .attr('transform',`translate(0,${-chart_margin.top/2})`)
                   .append('text');
    header.append('tspan').text('Budget vs. Revenue in $US');
    header.append('tspan').text('Top 100 films by budget, 2000-2009')
                          .attr('x',0).attr('y',20)
                          .style('font-size','0.8em').style('fill','#555');

    // ticks決定大概會有幾個刻度
    const xAxis = d3.axisBottom(xScale_v1)
                    .ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g')
                              .attr('class','x axis')
                              .attr('transform',`translate(-10,${chart_height+10})`)
                              .call(xAxis)
                              .call(addLabel,'Budget',25,0);
    // 拉開字與軸的距離
    xAxisDraw.selectAll('text').attr('dy','2em');

    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(formatTicks)
    .tickSizeInner(-chart_height)
    .tickSizeOuter(0);
    const yAxisDraw = this_svg.append('g').attr('class','y axis')
              .attr('transform',`translate(-10,${chart_height+10})`)
              .call(xAxis)
              .call(addLabel,'Revenue',-30,-30);
    // 拉開字與軸的距離
    yAxisDraw.selectAll('text').attr('dx','-2em');

    // 取得在選取範圍中的資料
    function brushed(e){
    //debugger
    if(e.selection){
        //取得選取的矩形座標
        const [[x0,y0],[x1,y1]] = e.selection;
        //判斷有那些資料落在選取範圍中
        const selected = scatterData.filter(
            d =>
            x0 <= xScale_v1(d.budget) && xScale_v1(d.budget) < x1 &&
            y0 <= yScale(d.revenue) && yScale(d.revenue) < y1
        );
        console.log(selected);
        // 將選取資料顯示在右邊顯示區
        updateSelected(selected);
        highlightSelected(selected); // 凸顯的顏色
    }else{
        d3.select('.selected-body').html('') //清空html,解決取消選取時資料還在的問題
        highlightSelected([]); // 取消選取
    }
}
    // 將選取的完整資料顯示在右邊顯示區
    function updateSelected(data){
        d3.select('.selected-body').selectAll('.selected-element')
          // 右邊清單選取項目，左邊的對應點放大
          .on('mouseover', mouseoverListItem)
          .on('mouseout', mouseoutListItem)
          .data(data, d=>d.id).join(
            enter => {
                enter.append('p').attr('class','selected-element')
                     .html(
                        d => `<span class="selected-title">${d.title}</span>,
                        <br>budget:${formatTicks(d.budget)} | 
                        revenue: ${formatTicks(d.revenue)}`
                     );
            },
            update => {
                update
            },
            exit => {
                exit.remove();
            }
          )
    }

    // 建立mouseoverListItem 及 mouseoutListItem 的function
    let selectedId;

    function mouseoverListItem(){
        selectedId = d3.select(this).data()[0].id;
        d3.selectAll('.scatter')
          .filter(d=>d.id === selectedId)
          .transition()
          .attr('r',6)
          .style('fill', 'cadetblue')
    }

    function mouseoutListItem(){
        selectedId = d3.select(this).data()[0].id;
        d3.selectAll('.scatter')
          .filter(d =>d.id === selectedId)
          .transition()
          .attr('r',3)
          .style('fill', 'coral')
        }

    // 左邊選取一群點，會變成別的顏色
    function highlightSelected(data){
        const selectedId = data.map(d=>d.id); //傳入data -> map -> id
        d3.selectAll('.scatter').filter(d=>selectedId.includes(d.id))
          .style('fill', 'lightseagreen');

        d3.selectAll('.scatter').filter(d=>!selectedId.includes(d.id))
          .style('fill', '#f00');

        
    }

// Add brush
    const brush = d3.brush().extent([[0,0],[svg_width,svg_height]]).on('brush end',brushed);
    this_svg.append('g').attr('class','brush').call(brush);

    d3.select('.selected-container')
      .style('width', `${svg_width}px`).style('height', `${svg_height}px`);




}






//Main
function ready(movies){
    const moviesClean = filterData(movies);
    const scatterData = prepareScatterData(moviesClean);
    console.log(scatterData);
    setupCanvas(scatterData);
}




d3.csv('data/movies.csv',type).then(
    res => {
        ready(res);
        // console.log(res);
    }
);