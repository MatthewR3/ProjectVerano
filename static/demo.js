$(document).ready(function() {

	console.log("jQuery Loaded");
	if (d3) {
		console.log("D3 Loaded");
	}

	// Algorithm selection effects
	$("li").click(function() {
		if ($(this).css("border-right-width") == "10px") {
			$(this).css("border-right", "none");
			$(this).css("padding-left", "0");
		}
		else {
			$(this).css("border-right", "10px solid #9CBCD6");
			$(this).css("padding-left", "10px");
		}
	});

});

// Date format is YYYY-MM-DD
function parse_dates() {

	start_date = $("#start_date").val();
	end_date = $("#end_date").val();
	train_date = $("#train_date").val();

	start_year = start_date.split("-")[2];
	start_month = start_date.split("-")[0];
	start_day = start_date.split("-")[1];
	start_date = start_year + "-" + start_month + "-" + start_day;

	end_year = end_date.split("-")[2];
	end_month = end_date.split("-")[0];
	end_day = end_date.split("-")[1];
	end_date = end_year + "-" + end_month + "-" + end_day;

	train_year = train_date.split("-")[2];
	train_month = train_date.split("-")[0];
	train_day = train_date.split("-")[1];
	train_date = train_year + "-" + train_month + "-" + train_day;

	return {start_date, end_date, train_date};
}

// AJAX relic
// Returns historical data
// function ajax_get_data(start_date, end_date) {
// 	$.ajax({
// 		url: "/ajax/get_data/",
// 		type: "POST",
// 		data: {"start_date": start_date, "end_date": end_date},
// 		success: function(data){
// 			console.log("Ajax call return")
// 			return data;
// 		},
// 		failure: function(){
// 			alert("ERROR: Failure to receive data");
// 		},
// 	});

// }

function draw_bar_graph() {

	var data = [4, 8, 15, 16, 23, 42, 54, 56, 61, 65, 73, 83, 85, 94];

	var max_x = $("#display").width();
	console.log(max_x);

	var x = d3.scale.linear()
    	.domain([0, d3.max(data)])
    	.range([0, max_x - 10]);

	d3.select("#display")
  		.selectAll("div")
    .data(data)
  		.enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });
}

function draw_line_graph() {

	var dates = parse_dates();
	//console.log(dates);
	var start_date = dates["start_date"];
	var end_date = dates["end_date"];
	var train_date = dates["train_date"];

	//var start_date = "2016-05-03";
	//var end_date = "2016-05-18";

	// Prints out selected algorithm values
	$("li").each(function() {
		if ($(this).css("border-right-width") == "10px") {
			//console.log($(this).val());
		}
	});

	// var data = ajax_get_data("2016-05-10", "2016-05-20");
	// console.log("After ajax call");

	// Test data
	// var data = [{date: "20111001",	"A": 63.4, "B": 62.7, "C": 72.2},
	// 		{date: "20111002",	"A": 58.0, "B": 59.9, "C": 67.7},
	// 		{date: "20111003",	"A": 53.3, "B": 59.1, "C": 69.4},
	// 		{date: "20111004",	"A": 55.7, "B": 58.8, "C": 68.0},
	// 		{date: "20111005",	"A": 64.2, "B": 58.7, "C": 72.4},
	// 		{date: "20111006",	"A": 58.8, "B": 57.0, "C": 77.0},
	// 		{date: "20111007",	"A": 57.9, "B": 56.7, "C": 82.3},
	// 		{date: "20111008",	"A": 61.8, "B": 56.8, "C": 78.9},
	// 		{date: "20111009",	"A": 69.3, "B": 56.7, "C": 68.8}];

	// Sets the dimensions of the canvas / graph
	var max_x = $("#display").width();
	var max_y = $("#display").height();
	var margin = {top: 20, right: 180, bottom: 30, left: 80},
    width = max_x - margin.left - margin.right,
    height = max_y - margin.top - margin.bottom - 20;

    // console.log(width);
    // console.log(height);
    // console.log(margin);

    // Parse the date / time
	var parseDate = d3.time.format("%Y-%m-%d").parse;

	// Set the ranges
	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	// ?
	var color = d3.scale.category10();

	// Define the axes
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	// Define the line
	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.close); });

	// Adds the svg canvas
	var svg = d3.select("#display").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
			.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	// Get the data

	var request_data = {"start_date": start_date, "end_date": end_date};
	var data;

	// Note: make sure to stringify objects before sending request
	d3.json("/ajax/get_data/").post(JSON.stringify(request_data), function(error, json) {
		if (error) return console.warn(error);
		data = json;



		// Use the data

		// ?
		color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

		data.forEach(function(d) {
			d.date = parseDate(d.date);
		});

		// Color the lines differently
		var algorithms = color.domain().map(function(name) {
			return {
	  			name: name,
	  			values: data.map(function(d) {
	    			return {date: d.date, close: +d[name]};
	  			})
			};
		});

		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return d.date; }));

		y.domain([
			d3.min(algorithms, function(c) { return d3.min(c.values, function(v) { return v.close; }); }),
			d3.max(algorithms, function(c) { return d3.max(c.values, function(v) { return v.close; }); })
		]);

		// Add the x-axis
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		// Add the y-axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Closing Price ($)");

		// Add the algorithm svg element (container)
		var algorithm = svg.selectAll(".algo")
			.data(algorithms)
				.enter().append("g")
			.attr("class", "algo");

		// Adds path between data points
		algorithm.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

		// Adds algorithm and its text (text appears .35em above and 3px to the right of the end)
		algorithm.append("text")
			.datum(function(d) { return {name: "S&P 500 Actual", value: d.values[0]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.close) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });
	});
}