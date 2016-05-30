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

	$(".date").keyup(function() {
		validate_input();
	});

	$("li").click(function() {
		validate_input();
	});

	validate_input();

});

function fill_defaults() {
	// Fills in default date values
	$("#start_date").val("1-1-1995");
	$("#end_date").val("3-1-2005");
	$("#train_date").val("1-1-2005");

	// Clears algorithm inputs then fills in first 2
	$("li").css("border-right", "none");
	$("li").css("padding-left", "0");
	$("li").slice(0, 2).css("border-right", "10px solid #9CBCD6");
	$("li").slice(0, 2).css("padding-left", "10px");

	validate_input();
}

function validate_input() {
	var all_valid = true;

	// Checks that dates are formatted correctly
	var date_regex = /^\d{1,2}-\d{1,2}-\d{4}$/;
	$(".date").each(function() {
		if (date_regex.test($(this).val())) $(this).prev().css("color", "#555");
		else {
			$(this).prev().css("color", "#FF8C8C");
			all_valid = false;
		}
	});

	// Checks if dates are in correct order : start_date < train_date < end_date
	if (all_valid) {
		var dates = parse_dates();
		var start_date = new Date(dates["start_date"]);
		var end_date = new Date(dates["end_date"]);
		var train_date = new Date(dates["train_date"]);
		if (start_date > end_date) {
			$("#start_date").prev().css("color", "#FF8C8C");
			$("#end_date").prev().css("color", "#FF8C8C");
			all_valid = false;
		}
		if (train_date > end_date) {
			$("#train_date").prev().css("color", "#FF8C8C");
			$("#end_date").prev().css("color", "#FF8C8C");
			all_valid = false;
		}
		if (start_date > train_date) {
			$("#start_date").prev().css("color", "#FF8C8C");
			$("#train_date").prev().css("color", "#FF8C8C");
			all_valid = false;
		}
	}

	// Checks if any algorithm is selected
	var selected = false;
	$("li").each(function() {
		if ($(this).css("border-right-width") == "10px") {
			selected = true;
		}
	});

	if (selected) {
		$("#algorithms").css("color", "#555");
	}
	else {
		$("#algorithms").css("color", "#FF8C8C");
		all_valid = false;
	}

	if (all_valid) {
		console.log("Valid");
		$("#generate").prop("disabled", false);
		$("#generate").css("color", "");
		$("#generate").css("border-color", "");
		$("#generate").css("pointer-events", "auto");
	}
	else {
		console.log("Invalid");
		$("#generate").prop("disabled", true);
		$("#generate").css("color", "#DDD");
		$("#generate").css("border-color", "#DDD");
		$("#generate").css("pointer-events", "none");
	}

	return all_valid;
}

// Input date format is MM-DD-YYY
// Output date format is YYYY-MM-DD
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

function full_algo_name(code) {
	if (code == "actual") return "Actual Performance";
	else if (code == "slope") return "Slope Analysis";
	return code
}

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

	if (!validate_input()) {
		alert("Please enter valid inputs before testing");
		return;
	}

	// Retrieves and parses data

	var dates = parse_dates();
	var start_date = dates["start_date"];
	var end_date = dates["end_date"];
	var train_date = dates["train_date"];

	// Collects selected algorithm values
	var algorithms = [];
	$("li").each(function() {
		if ($(this).css("border-right-width") == "10px") {
			algorithms.push($(this).val());
		}
	});

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



	// Sets up SVG elements

	// Clears the display
	$("#display").empty();
	$("#display").append('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');

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



	// Gets the data

	var request_data = {"start_date": start_date, "end_date": end_date, "train_date": train_date, "algorithms": algorithms};
	var data;

	// Note: make sure to stringify objects before sending request
	d3.json("/ajax/get_data/").post(JSON.stringify(request_data), function(error, json) {
		if (error) return console.warn(error);
		data = json;



		// Uses the data

		// Clears the display
		$("#display").empty();

		// Adds the svg canvas
		var svg = d3.select("#display").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
			.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
			.datum(function(d) { return {name: full_algo_name(d.name), value: d.values[0]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.close) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });
	});
}