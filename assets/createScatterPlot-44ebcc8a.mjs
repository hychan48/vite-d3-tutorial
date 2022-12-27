/**
 * assumes tooltip has css
 * i think i can append it though
 */
const sampleData = [
  { x: 0, y: 0,i:0},
  { x: 0.01, y: 0.01,i:1 },
  { x: 0.02, y: 0.02,i:2 },
  { x: 0.03, y: 0.03,i:3 },
  { x: 0, y: 0.5,i:4 },
  { x: 0.01, y: 0.51,i:5 },
  { x: 0.02, y: 0.52,i:6 },
  { x: 0.03, y: 0.53 ,i:7},
  { x: 0.5, y: 0 ,i:8},
  { x: 0.51, y: 0.01,i:9 },
  { x: 0.52, y: 0.02 ,i:10},
  { x: 0.53, y: 0.03 ,i:11},
  { x: 0.5, y: 0.5 ,i:12},
  { x: 0.51, y: 0.51 ,i:13},
  { x: 0.52, y: 0.52 ,i:14},
  { x: 0.53, y: 0.53 ,i:15}
];
const data = sampleData;
const width = 600,height=300;
const margin = ({top: 20, right: 30, bottom: 30, left: 40})
const x = d3.scaleLinear()
  .domain(d3.extent(data, d => d.x)).nice()
  .rangeRound([margin.left, width - margin.right]);
const y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.y)).nice()
  .rangeRound([height - margin.bottom, margin.top]);


const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);


const xAxis = g => g.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:last-of-type text").clone()
    .attr("y", -3)
    .attr("dy", null)
    .attr("font-weight", "bold")
    .text(data.x));

const yAxis = g => g.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).tickSizeOuter(0))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:last-of-type text").clone()
    .attr("x", 3)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text(data.y))

const xG = svg.append("g")
  .call(xAxis);

const yG = svg.append("g")
  .call(yAxis);

const circles = svg
  .append("g")
  .attr("id","gCircles")
  .selectAll("circle")
  .data(data)
  .join("circle")
  .attr("stroke", "white")
  .attr("id", d => `d3i_${d.i}`)//added to make them selectable
  .attr("cx", d => x(d.x))
  .attr("cy", d => y(d.y))
  .attr("r", 4)


/**
 *  tooltip https://gramener.github.io/d3js-playbook/tooltips.html
 *            position: absolute;
 *           pointer-events: none;
 *           background: #000;
 *           color: #fff;
 *  */
const tip = d3.select("#my_dataviz")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", 'absolute')
  .style("pointer-events:", 'none')
  .style("background", '#000')
  .style("color", '#fff')


circles
  .on('mouseover',function (event,datum){
    // console.log('mouse over',event,datum);
    tip.style("opacity", 1)
      // .html('hi')
      .html('x: ' + datum.x + "<br/> y: " + datum.y + "<br/> i: " + datum.i)
      .style("left", (event.pageX-25) + "px")
      .style("top", (event.pageY-75) + "px")


  })
  .on("mouseout", function(d) {
    tip.style("opacity", 0)
  })

function createLines(){
  const projection = d3.geoProjection
  const line = svg.selectAll("line")
    .data(data)
    // .enter()
    .append("line")
    .join('line')
    // .attr("x1", d=>projection(d[0])[0])
    .attr("x1", (d,i,datas) => {
      console.log('x1',d.x,x(d.x));
      // debugger
      return x(d.x)
      // return projection(d[0])[0]
    })
    .attr("x2", (d,i,datas) => {
      // debugger
      return x(data[(i + 1) % data.length].x)
    })
    .attr("y1", (d,i,datas) => {
      return y(d.y)
    })
    .attr("y2", (d,i,datas) => {

      return y(data[(i + 1) % data.length].y)
    })
    // .attr("y1", d=>projection(d[0])[1])
    // .attr("x2", d=>projection(d[1])[0])
    // .attr("y2", d=>projection(d[1])[1])
    // .attr("y1", d=>projection(d[0])[1])
    // .attr("x2", d=>projection(d[1])[0])
    // .attr("y2", d=>projection(d[1])[1])
    .attr("stroke-width", 1)
    .attr("stroke", "yellow")

    // .attr("x1", 0)
    // .attr("y1", 0)
    // .attr("x2", 200)
    // .attr("y2", 200);



  console.log('line',line,line.size());
}
// import {transition} from "https://d3js.org/d3-transition"
// createLines()
function appendConnectingLine(d1=0,d2=1){
  const lineColor = 'black'
  const xy1 = data[d1]
  const xy2 = data[d2]
  const path = svg
    .append("line")
    .attr("x1", x(xy1.x))
    .attr("y1", y(xy1.y))
    .attr("x2", x(xy2.x))
    .attr("y2", y(xy2.y))
    .attr("stroke",lineColor)
    .attr("stroke-width",1)

  // https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61


  //transition works on zooming interesting
  // const transitionPath = d3
  //   .transition()
  //   .ease(d3.easeSin)
  //   .duration(25000)
  //   .delay(25000);
  // const pathLength = path.node().getTotalLength();
  // console.log({pathLength});
  // path
  //   // .attr("stroke-dashoffset", pathLength)//this will make it not work at all...
  //   // .attr("stroke-dasharray", pathLength)
  //   // .attr("stroke-dashoffset", 0)
  //   .attr("stroke-dasharray", 3)//this just makes it a dash
  //
  //   .transition(transitionPath)
  //   .style("transition",'0.5s')
  //   .attr("transition",'0.5s')

  return path;
}
// await new Promise(resolve => setTimeout(resolve, 1000));
// appendConnectingLine()
const pathG = appendConnectingLine(0,15)

/**
 * try zoom
 * https://gist.github.com/d3noob/7b7e98331f440139dff50f4a58044677
 * */
const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on('zoom', function(event) {
    d3.select('#gCircles')
      // .selectAll('path')
      .attr('transform', event.transform);
    xG
      .attr('transform', event.transform);
    yG
      .attr('transform', event.transform);
    pathG
      .attr('transform', event.transform);
  });
/**
 * zoom reset
 * https://observablehq.com/@d3/programmatic-zoom
 */
d3.select("#my_dataviz").on('click',function(event,datum){
  const {ctrlKey} = event;
  if(ctrlKey){
    svg.transition().duration(0).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }
  // console.log("clicked",event,datum);
})
svg.call(zoom);

