
// Define the dimensions of the chart
var margin = { top: 20, right: 30, bottom: 140, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create the SVG container
var svg = d3.select(".chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the data from the CSV file
d3.csv("Data/co2.csv", function(data) {
    // Filter data for the specified years
    var years = ["2005", "2010", "2015", "2018"];
    var filteredData = data.filter(function(d) {
        return years.includes(d.Year);
    });

    // Define the x-axis scale and domain
    var x = d3.scaleBand()
        .domain(filteredData.map(function(d) { return d.Countries_Region; }))
        .range([0, width])
        .padding(0.3);

    // Define the y-axis scale and domain
    var y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, function(d) { return parseFloat(d["Emissions per capita (metric tons of carbon dioxide)"]); })])
        .nice()
        .range([height, 0]);

    // Define a custom color range for your bars
    var customColorRange = ["#CDEE77", "#B4E639", "#8ABF2C", "#2F6B1A"];

    // Create a color scale using D3's scaleOrdinal
    var colorScale = d3.scaleOrdinal()
        .domain(years)
        .range(customColorRange);

// Create x-axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", "14px")
    .attr("transform", "rotate(-45)");

// Create y-axis
svg.append("g")
    .call(d3.axisLeft(y).ticks(10).tickSize(0)) // Removed horizontal gridlines
    .selectAll("text")
    .attr("font-size", "14px");

// Add x-axis label
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 100)
    .style("text-anchor", "middle")
    .text("Countries");

// Add y-axis label
svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("CO2 Emissions per Capita");

// Create separate bars for each year within each country group
var bars = svg.selectAll(".bar")
    .data(filteredData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Countries_Region) + x.bandwidth() / years.length * years.indexOf(d.Year); })
    .attr("y", function(d) { return y(parseFloat(d["Emissions per capita (metric tons of carbon dioxide)"])); })
    .attr("width", x.bandwidth() / years.length)
    .attr("height", function(d) { return height - y(parseFloat(d["Emissions per capita (metric tons of carbon dioxide)"])); })
    .attr("fill", function(d) { return colorScale(d.Year); })
    .on("mouseover", function(d) {
        // Show tooltip on mouseover
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html("Country: " + d.Countries_Region + "<br>Year: " + d.Year + "<br>Emissions per capita: " + d["Emissions per capita (metric tons of carbon dioxide)"])
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        // Hide tooltip on mouseout
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Define and append the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Legends
var legend = svg.selectAll(".legend")
    .data(years)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) {
        return colorScale(d);
    });

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
        return d;
    });
});