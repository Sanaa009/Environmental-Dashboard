// The svg
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const projection = d3.geoMercator()
  .center([0, 25]) // GPS of location to zoom on
  .scale(140) // This is like the zoom
  .translate([width / 2, height / 2]);

// Create a tooltip div
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

Promise.all([
  d3.json("Data/world.geojson"),
  d3.csv("Data/arable.csv")
]).then(function (initialize) {
  let dataGeo = initialize[0];
  let data = initialize[1];

  // Create a unique color for each country based on its index
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, data.length - 1]);

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .join("path")
    .attr("fill", "#b8b8b8")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "none")
    .style("opacity", 0.3);

  // Create a group for the dots
  const dotsGroup = svg.append("g")
    .attr("class", "dots");

  // Create a legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 150}, 20)`);

  // Add circles (dots) based on arable land percentage
  dotsGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("g")
    .selectAll("circle")
    .data((d, i) => {
      const numDots = Math.round(d.arable_land) * 1; // Number of dots based on arable land percentage
      return Array.from({ length: numDots }, () => ({ ...d, index: i })); // Create an array of data for each country with index
    })
    .enter()
    .append("circle")
    .attr("cx", d => {
      const xOffset = Math.random() * 22; // Larger random x-offset for spreading dots
      return projection([+d.homelon, +d.homelat])[0] + xOffset - 10;
    })
    .attr("cy", d => {
      const yOffset = Math.random() * 35; // Larger random y-offset for spreading dots
      return projection([+d.homelon, +d.homelat])[1] + yOffset - 20;
    })
    .attr("r", 3) // Fixed radius for each dot
    .style("fill", d => colorScale(d.index)) // Assign a unique color to each country based on index
    .attr("stroke", d => {
      if (+d.arable_land > 100) {
        return "black";
      } else {
        return "none";
      }
    })
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.9)
    .on("mouseover", function (event, d) {
      // Show tooltip on mouseover
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`Country: ${d.Country}<br>Arable Land (%): ${d.arable_land}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function (d) {
      // Hide tooltip on mouseout
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Create legend items
  const legendItems = legend.selectAll("g.legend-item")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems.append("rect")
    .attr("x", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (d, i) => colorScale(i));

  legendItems.append("text")
    .text(d => d.Country)
    .attr("x", 20)
    .attr("y", 10);
});
