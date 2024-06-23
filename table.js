// Load data from the CSV file
d3.csv("Data/threat.csv", function(data) {
    // Filter the data for the year 2022
    var year2022Data = data.filter(function(d) {
        return d.Year === "2022";
    });

    // Select the table body
    var tbody = d3.select("tbody");

    // Create an array of countries for the table
    var countries = ["Australia", "China", "India", "Norway", "United States of America"];

    // Create a color scale for background color
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(year2022Data, function(d) {
            return d3.max([
                +d["Threatened Species: Plants (number)"],
                +d["Threatened Species: Invertebrates (number)"],
                +d["Threatened Species: Vertebrates (number)"]
            ]);
        })])
        .range(["#CDEE77","#143f17"]);

    // Create the table header row with columns for each species type
    var thead = d3.select("thead").select("tr");
    thead.selectAll("th")
        .data(["Country", "Plants", "Invertebrates", "Vertebrates"])
        .enter()
        .append("th")
        .text(function(d) {
            return d;
        })
        .style("background-color", "#143f17") // Dark green background for header
        .style("color", "#CDEE77"); // Light yellow text color for header

    // Create a row for each country and populate it with data
    var rows = tbody.selectAll("tr")
        .data(countries)
        .enter()
        .append("tr");

    rows.append("td")
        .text(function(d) {
            return d;
        })
        .style("background-color", "#143f17") // Light blue background for country name cells
        .style("color", "#CDEE77"); // Text color for country name cells

    rows.selectAll("td.species-data")
        .data(function(country) {
            var countryData = year2022Data.find(function(d) {
                return d.Countries_Region === country;
            });
            return [
                +countryData["Threatened Species: Plants (number)"],
                +countryData["Threatened Species: Invertebrates (number)"],
                +countryData["Threatened Species: Vertebrates (number)"]
            ];
        })
        .enter()
        .append("td")
        .classed("species-data", true)
        .style("background-color", function(d) {
            return colorScale(d);
        })
        .style("color", function(d) {
            // Set text color based on the background color for visibility
            return d3.lab(colorScale(d)).l < 70 ? "#ffffff" : "#000000";
        })
        .text(function(d) {
            return d;
        });




// Create an SVG element for the legend
var legendSvg = d3.select("#legend-container")
    .append("svg")
    .attr("width", 600) // Adjust the width as needed
    .attr("height", 80); // Adjust the height as needed

// Define custom gradient start and stop colors
var startColor = "#CDEE77"; // Lightest color
var stopColor = "#143f17"; // Darkest color

// Create a gradient for the legend
var defs = legendSvg.append("defs");

var gradient = defs.append("linearGradient")
    .attr("id", "color-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "80%")
    .attr("y2", "0%");

// Define the gradient stops with interpolation
gradient.append("stop")
    .attr("offset", "0%")
    .style("stop-color", startColor);

gradient.append("stop")
    .attr("offset", "100%")
    .style("stop-color", stopColor);
// Create a rectangle to display the gradient
legendSvg.append("rect")
    .attr("x", 73) // Adjust the x-coordinate as needed
    .attr("y", 10) // Adjust the y-coordinate as needed
    .attr("width", 380) // Adjust the width as needed
    .attr("height", 20) // Adjust the height as needed
    .style("fill", "url(#color-gradient)");

// Add text labels for the legend
legendSvg.append("text")
    .attr("x", 73) // Adjust the x-coordinate as needed
    .attr("y", 50) // Adjust the y-coordinate as needed
    .text("Lower count")
    .style("fill", "#143f17"); // Text color for lighter shade

legendSvg.append("text")
    .attr("x", 358) // Adjust the x-coordinate as needed
    .attr("y", 50) // Adjust the y-coordinate as needed
    .text("Higher count")
    .style("fill", "#143f17"); // Text color for darker shade






});



