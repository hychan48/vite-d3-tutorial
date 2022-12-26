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

svg.append("g")
  .call(xAxis);

svg.append("g")
  .call(yAxis);

const circles = svg
  .append("g")
  .attr("stroke", "white")
  .selectAll("circle")
  .data(data)
  .join("circle")
  .attr("id", d => `d3i_${d.i}`)//added to make them selectable
  .attr("cx", d => x(d.x))
  .attr("cy", d => y(d.y))
  .attr("r", 4)


/* tooltip https://gramener.github.io/d3js-playbook/tooltips.html */
const tip = d3.select("#my_dataviz")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

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
