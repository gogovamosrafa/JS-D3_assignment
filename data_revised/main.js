const friends = {
    stark:['Apple','Banana','Lemon','Cherry','Watermelon'],
    heidou:['Apple','Peach','Grape','Papaya'],
    terri:['Apple','Cherry','Guava','Grape']
};

const this_svg = d3.select('svg');
d3.selectAll('button').on('click',click);

function click(){
    const thisFruitlist = friends[this.dataset.name];
    update(thisFruitlist);
};

function update(data){
    this_svg.selectAll("text")
    .data(data, d=>d)
    .join(
        enter => {
            enter.append("text").text(d=>d)
                 .attr("x",-100).attr("y",(d,i)=>50+i*30)
                 .style("fill","yellowgreen")
                 .transition().attr("x",30)
        },
        update=>{
            update.transition()
                  .style('fill','orange').attr('y',(d,i)=>50+i*30);

        },
        exit=>{
            exit.transition()
                .attr("x",150)
                .style("fill","yellow").remove()
        }
    )
}