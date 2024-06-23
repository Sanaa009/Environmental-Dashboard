// The svg
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const projection = d3.geoMercator()
  .center([0, 10]) // GPS of location to zoom on
  .scale(120) // This is like the zoom
  .translate([width / 2, height / 2]);

// Create a tooltip div
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

Promise.all([
  d3.json("Data/world.geojson"),
  d3.csv("Data/Proportional_map.csv")
]).then(function (initialize) {
  let dataGeo = initialize[0];
  let data = initialize[1];

  // Create a color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.homecontinent))
    .range(d3.schemePaired);

  // Add a scale for bubble size
  const valueExtent = d3.extent(data, d => +d.CO2);
  const size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([12, 40]);  // Size in pixels

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

  // Add circles with the same green color
  svg
    .selectAll("myCircles")
    .data(data.sort((a, b) => +b.CO2 - +a.CO2).filter((d, i) => i < 1000))
    .join("circle")
    .attr("cx", d => projection([+d.homelon, +d.homelat])[0])
    .attr("cy", d => projection([+d.homelon, +d.homelat])[1])
    .attr("r", d => size(+d.CO2))
    .style("fill", "green") // Set the circles to green
    .attr("stroke", d => {
      if (d.CO2 > 2000) {
        return "black";
      } else {
        return "none";
      }
    })
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.4)
    .on("mouseover", function (event, d) {
      // Show tooltip on mouseover
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`Country: ${d.Country}<br>CO2 emissions per capita: ${d.CO2}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function (d) {
      // Hide tooltip on mouseout
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Add legend: circles
  const valuesToShow = [1.6, 6, 12, 18];
  const xCircle = 60;
  const xLabel = 120;
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .join("circle")
    .attr("cx", xCircle)
    .attr("cy", d => height - 80 - size(d))
    .attr("r", d => size(d))
    .style("fill", "none")
    .attr("stroke", "black");

  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .join("line")
    .attr('x1', d => xCircle + size(d))
    .attr('x2', xLabel)
    .attr('y1', d => height - 80 - size(d))
    .attr('y2', d => height - 80 - size(d))
    .attr('stroke', 'black')
    .style('stroke-dasharray', '2,2');

  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .join("text")
    .attr('x', xLabel)
    .attr('y', d => height - 80 - size(d))
    .text(d => d)
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle');

  // Add legend title
  svg.append("text")
    .attr("x", xLabel - 120)
    .attr("y", height - 180) // Adjust the Y position as needed
    .text("Legend (CO2 Emissions per capita)")
    .style("font-size", 12)
    .attr('alignment-baseline', 'middle');
});