// Load data from the CSV file
d3.csv("Data/land.csv", function(data) {
  // Filter the data for the year 2019
  data = data.filter(function(d) {
      return d.Year === "2019";
  });

  var margin = { top: 80, left: 80, bottom: 130, right: 50 };
  var width = 900 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  var svg = d3.select('#chart2')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var PAD = 0.3;
  var yDomain = d3.extent(data, d => parseFloat(d["Forest cover (% of total land area)"]));
  var y = d3.scaleLinear()
      .domain([yDomain[0] - PAD, yDomain[1] + PAD])
      .range([height, 0]);

  var xDomain = d3.extent(data, d => parseFloat(d["Arable land (% of total land area)"]));
  var x = d3.scaleLinear()
      .domain([xDomain[0] - PAD, xDomain[1] + PAD])
      .range([0, width]);

  // Create a color scale using D3's scaleSequential with Viridis color scheme
  var color = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, data.length]);

  // Create circles for each data point with increased size and color
  svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 8) // Increase the size of the data point markers
      .attr('cx', d => x(parseFloat(d["Arable land (% of total land area)"])))
      .attr('cy', d => y(parseFloat(d["Forest cover (% of total land area)"])))
      .attr('class', 'dot')
      .style('fill', (d, i) => color(i)) // Assign colors using the Viridis color scheme
      .on('mouseover', function(d) {
          // Show tooltip on mouseover
          tooltip.transition()
              .duration(200)
              .style('opacity', .9);
          tooltip.html(d.Countries_Region + '<br>X: ' + d["Arable land (% of total land area)"] + '% Arable Land<br>Y: ' + d["Forest cover (% of total land area)"] + '% Forest Cover')
              .style('left', (d3.event.pageX + 5) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
          // Hide tooltip on mouseout
          tooltip.transition()
              .duration(500)
              .style('opacity', 0);
      });

  // Create and append X and Y axes
  var xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format('.2f'));
  var yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format('.2f'));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Add X and Y axis labels and titles
  svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top - 30)
      .style('text-anchor', 'middle')
      .text('Arable land (% of total land area)');

  svg.append('text')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 35)
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Forest cover (% of total land area)');

  // Create a tooltip
  var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  // Create legend
  var legend = svg.selectAll(".legend")
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
      });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => color(i)); // Assign colors based on the color scale

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d.Countries_Region); // Use country names as legend labels

  // Create a linear gradient for the legend
  var defs = svg.append("defs");

  var linearGradient = defs.append("linearGradient")
      .attr("id", "color-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

  // Define color stops for the gradient
  linearGradient.append("stop")
      .attr("offset", "0%")
      .style("stop-color", color(0));

  linearGradient.append("stop")
      .attr("offset", "100%")
      .style("stop-color", color(data.length - 1));

  // Create a rectangle for the legend
  svg.append("rect")
      .attr("x", width -820)
      .attr("y", height + margin.top +30)
      .attr("width", 440)
      .attr("height", 15)
      .style("fill", "url(#color-gradient)");

  // Add legend labels
  svg.append("text")
      .attr("x", width - 820)
      .attr("y", height + margin.top +20)
      .style("text-anchor", "start")
      .text("Low forest cover %");

  svg.append("text")
      .attr("x", width - 520)
      .attr("y", height + margin.top +20 )
      .style("text-anchor", "start")
      .text("High forest cover %");
});
