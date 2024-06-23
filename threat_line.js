// Load data from the CSV file
d3.csv("Data/threat.csv", function(data) {
    // Define the dimensions of the chart
    var margin = { top: 50, right: 210, bottom: 60, left: 100 }; // Adjusted margins for titles
    var width = 1000 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // Create an SVG element
    var svg = d3.select("#line-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Convert string values to numbers
    data.forEach(function(d) {
        d.Year = +d.Year;
        d["Threatened Species: Total (number)"] = +d["Threatened Species: Total (number)"].replace(/,/g, '');
    });

    // Create scales for x and y axes
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Threatened Species: Total (number)"])])
        .nice()
        .range([height, 0]);

    // Create a line generator
    var lineGenerator = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d["Threatened Species: Total (number)"]));

    // Define a D3 color scale
    var colorScale = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.Countries_Region))].slice(0, 5)) // Select the first five countries
        .range(["#CDEE77", "#B4E639", "#8ABF2C", "#2F6B1A", "#143f17"]);

        var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw lines for each country and specify custom line colors using the color scale
    [...new Set(data.map(d => d.Countries_Region))].slice(0, 5).forEach((country, index) => {
        svg.append("path")
            .datum(data.filter(d => d.Countries_Region === country))
            .attr("class", "line")
            .attr("d", lineGenerator)
            .style("fill", "none")
            .style("stroke", colorScale(country)) // Use the color scale
            .style("stroke-width", 2.5)
            .on("mouseover", function() {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(country)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
    // Add x-axis with title
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(7));

    // Add x-axis title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20) // Adjusted placement
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Year");

    // Add y-axis with title
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add y-axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 40) // Adjusted placement
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Number of Threatened Species");

    // Create a legend using the color scale
    var legend = svg.selectAll(".legend")
        .data([...new Set(data.map(d => d.Countries_Region))].slice(0, 5)) // Select the first five countries
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + (i * 20) + ")"; });

    legend.append("rect")
        .attr("x", width + 6)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d) => colorScale(d)); // Use the color scale for the legend

    legend.append("text")
        .attr("x", width + 28)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) { return d; });
});
