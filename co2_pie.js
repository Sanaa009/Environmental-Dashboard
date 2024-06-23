
d3.csv('Data/land.csv', d => {
    var data2019 = d.filter(item => item.Year === '2019');
    var forestCoverData = data2019.map(item => ({
      country: item.Countries_Region,
      forestCover: +item['Forest cover (thousand hectares)'].replace(/,/g, '')
    }));
  
    var svg = d3.select('#pie-chart'),
      width = +svg.attr('width'),
      height = +svg.attr('height'),
      radius = 300,
      g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  
    var color = d3.scaleOrdinal()
      .domain(forestCoverData.map(d => d.country))
      .range([ "#B4E639", "#8ABF2C", "#2F6B1A", "#143f17", "#CDEE77"]);
  
    var pie = d3.pie()
      .value(d => d.forestCover)
      .sort(null);
  
    var path = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(0);
  
    var label = d3.arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 40);
  
    var arc = g.selectAll('.arc')
      .data(pie(forestCoverData))
      .enter()
      .append('g')
      .attr('class', 'arc');
  
    arc.append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.country));
  
      arc.append('text')
      .attr('transform', d => 'translate(' + label.centroid(d) + ')')
      .style('fill', d => (d3.lab(color(d.data.country)).l > 70) ? '#2F6B1A' : '#ffff') // Set text color based on the darkness of the slice's color
      .text(d => {
          const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
          return d.data.country + ' (' + d.data.forestCover + ' kHa)';
      });
  
    // Legend
    var legend = svg.selectAll(".legend")
      .data(forestCoverData.map(d => d.country))
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");
  
    legend.append("rect")
      .attr("x", 0)
      .attr("y",520)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => color(d));
  
    legend.append("text")
      .attr("x", 20)
      .attr("y", 529)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d);
  });
  