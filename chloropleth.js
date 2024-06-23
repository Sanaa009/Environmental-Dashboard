
  // The svg
const svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
.scale(120)
.center([0, 10])
.translate([width / 2, height / 2]);

// Data and color scale
let data = new Map();
const colorScale = d3.scaleThreshold()
.domain([65, 100, 300, 500, 600, 700, 800])
.range(d3.schemeGreens[7]);

// Create a tooltip div
const tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Load external data and boot
Promise.all([
d3.json("Data/world.geojson"),
d3.csv("Data/plant_data.csv", function (d) {
  data.set(d.code, +d.threat_plant);
})
]).then(function (loadData) {
let topo = loadData[0];

// Draw the map
svg.append("g")
  .selectAll("path")
  .data(topo.features)
  .join("path")
  .attr("d", d3.geoPath()
    .projection(projection)
  )
  .attr("fill", function (d) {
    d.total = data.get(d.id) || 0;
    return colorScale(d.total);
  })
  // Add mouseover and mouseout events for the tooltip
  .on("mouseover", function (event, d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(`Country: ${d.properties.name}<br>Value: ${d.total}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 30) + "px");
  })
  .on("mouseout", function (d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
});

// Define the legend properties
const legendWidth = 300;
const legendHeight = 20;
const legendX = width - legendWidth; // Position on the top-right corner
const legendY = 30; // Adjust the Y position as needed
const numLegendBoxes = 7; // Number of separate boxes

// Create an SVG group for the legend
const legend = svg.append("g")
.attr("class", "legend")
.attr("transform", `translate(${legendX}, ${legendY})`);

// Calculate the range for each legend box
const colorRange = colorScale.range();
const legendBoxWidth = legendWidth / numLegendBoxes;

// Create legend color rectangles
for (let i = 0; i < numLegendBoxes; i++) {
legend.append("rect")
  .attr("x", i * legendBoxWidth)
  .attr("width", legendBoxWidth)
  .attr("height", legendHeight)
  .attr("fill", colorRange[i]);
}

// Create legend labels for each range
const legendLabels = [65, 100, 300, 500, 600, 700, 800]; // Update with your threshold values
for (let i = 0; i < numLegendBoxes; i++) {
legend.append("text")
  .attr("x", (i * legendBoxWidth + legendBoxWidth / 2))
  .attr("y", legendHeight + 20)
  .attr("text-anchor", "middle")
  .text(legendLabels[i]);
}

// Add a legend title
legend.append("text")
.attr("x", legendWidth / 2)
.attr("y", -10)
.attr("text-anchor", "middle")
.text("Legend (Number of Threatened species");

// Optional: Add a legend background
legend.insert("rect", ":first-child")
.attr("x", -5)
.attr("y", 60)
.attr("width", legendWidth + 10)
.attr("height", legendHeight + 30)
.attr("fill", "white")
.attr("opacity", 0.7);