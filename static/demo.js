$(document).ready(function() {

	// Global variable for keeping track of algorithm names by index
	ALGO_NAMES = ["actual", "slope_analysis", "pt_analysis", "moving_avg"];

	console.log("jQuery Loaded");
	if (d3) {
		console.log("D3 Loaded");
	}

	// Algorithm selection effects
	$("li").click(function() {
		if ($(this).css("border-right-width") == "10px") {
			// Checks to see if it is an inner options li
			if ($(this).parent().prev().is(".extrema-options, .vol-options")) $(this).css("border-right", "1px solid #D6D6D6");
			else $(this).css("border-right", "none");
			$(this).css("padding-left", "0");
		}
		else {
			$(this).css("border-right", "10px solid #9CBCD6");
			$(this).css("padding-left", "10px");
		}
	});

	// If absolute extrema option is clicked, show algorithms and select first child (actual)
	$(".extrema-options, .vol-options").click(function() {
		slideOptions(this);
	});

	// Detects whether any inner li in extrema options are selected and selects parent accordingly
	$(".extrema-options, .vol-options").next().children().click(function() {
		var enabled = false;
		$(this).parent().children().each(function() {
			if ($(this).css("border-right-width") == "10px") {
				enabled = true;
			}
		})
		if (enabled) {
			$(this).parent().prev().css("border-right", "10px solid #9CBCD6");
			$(this).parent().prev().css("padding-left", "10px");
		}
		else {
			$(this).parent().prev().css("border-right", "none");
			$(this).parent().prev().css("padding-left", "0");
			slideOptions($(this).parent().prev(), {"force_up": true});
			slideOptions($(this).parent().prev(), {"force_up": true});
		}
		validate_input();
	});

	$(".date").keyup(function() {
		validate_input();
	});

	$("li").click(function() {
		validate_input();
	});

	validate_input();
});



// UTILITY FUNCTIONS



// Slides options list up or down depending on options passed in or current state of list
function slideOptions(elem, options) {
	if (options == null) options = {};
	var force_up = options["force_up"] || false;
	var force_down = options["force_down"] ||false;
	// Slides options down
	if (($(elem).next().css("display") == "none" || force_down) && !force_up) {
		$(elem).css("border-bottom", "1px solid #D6D6D6");
		$(elem).next().children().first().css("border-right", "10px solid #9CBCD6");
		$(elem).next().children().first().css("padding-left", "10px");
		$(elem).next().slideDown(300, function() {
			// console.log("Slid options down");
		});
	}
	// Slides options up
	else {
		$(elem).css("border-bottom", "none");
		$(elem).next().children().css("border-right", "1px solid #D6D6D6");
		$(elem).next().children().css("padding-left", "0");
		$(elem).next().slideUp(300, function() {
			// console.log("slid options up");
		});
	}
}

function fill_defaults() {
	// Fills in default date values
	$("#start_date").val("1-1-1995");
	$("#end_date").val("3-1-2005");
	$("#train_date").val("1-1-2005");

	// Clears inputs then fills in first 2 algorithms and first 2 options
	$("li").css("border-right", "none");
	$("li").css("padding-left", "0");
	$("#algorithms").next().children().slice(0, 2).css("border-right", "10px solid #9CBCD6");
	$("#algorithms").next().children().slice(0, 2).css("padding-left", "10px");
	$("#options + ul > li").slice(0, 3).css("border-right", "10px solid #9CBCD6");
	$("#options + ul > li").slice(0, 3).css("padding-left", "10px");
	// Resets the borders on inner li in options
	$(".extrema-options + ul > li").css("border-right", "1px solid #D6D6D6");
	$(".extrema-options + ul > li").css("padding-left", "0");
	$(".vol-options + ul > li").css("border-right", "1px solid #D6D6D6");
	$(".vol-options + ul > li").css("padding-left", "0");
	// Fills in first 2 algorithms for each algorithm
	$("#abs-options > li").slice(0, 2).css("border-right", "10px solid #9CBCD6");
	$("#abs-options > li").slice(0, 2).css("padding-left", "10px");
	$("#loc-options > li").slice(0, 2).css("border-right", "10px solid #9CBCD6");
	$("#loc-options > li").slice(0, 2).css("padding-left", "10px");
	$("#vol-options > li").slice(0, 2).css("border-right", "10px solid #9CBCD6");
	$("#vol-options > li").slice(0, 2).css("padding-left", "10px");

	slideOptions("#abs-extrema", {"force_down": true});
	slideOptions("#loc-extrema", {"force_down": true});
	slideOptions("#vol", {"force_down": true});

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

	// Checks if any algorithm is selected and stores the selected algorithm's values in an array
	var selected_algos = [];
	var selected = false;
	$("#algorithms + ul > li").each(function() {
		if ($(this).css("border-right-width") == "10px") {
			selected = true;
			selected_algos.push($(this).val());
		}
	});

	if (selected) {
		$("#algorithms").css("color", "#555");
	}
	else {
		$("#algorithms").css("color", "#FF8C8C");
		all_valid = false;
	}



	// Checks options lists to make sure there aren't options selected for an algorithm that is not selected
	var valid = true;
	$(".extrema-options, .vol-options").next().children().each(function() {
		if ($(this).css("border-right-width") == "10px" && selected_algos.indexOf($(this).val()) == -1) {
			valid = false;
		}
	});

	if (valid) {
		$("#options").css("color", "#555");
	}
	else {
		$("#options").css("color", "#FF8C8C");
		all_valid = false;
	}



	if (all_valid) {
		// console.log("Inputs Valid");
		$("#generate").prop("disabled", false);
		$("#generate").removeClass("disabled");
	}
	else {
		// console.log("Inputs Invalid");
		$("#generate").prop("disabled", true);
		$("#generate").addClass("disabled");
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
	else if (code == "slope_analysis") return "Slope Analysis";
	return code
}



// GRAPHING FUNCTIONS



// Draws line graph of data retrieved via AJAX to server
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
	$("#algorithms").next().children().each(function() {
		if ($(this).css("border-right-width") == "10px") {
			algorithms.push($(this).val());
		}
	});

	// Collects selected option values
	var options = [];
	$("#options").next().children().each(function() {
		if ($(this).css("border-right-width") == "10px") {
			options.push($(this).val());
		}
	});

	// Collects selected absolute extrema algorithm values
	var abs_extrema_options = [];
	$("#abs-options").children().each(function() {
		if ($(this).css("border-right-width") == "10px") {
			abs_extrema_options.push($(this).val());
		}
	});

	// Collects selected local extrema algorithm values
	var loc_extrema_options = [];
	$("#loc-options").children().each(function() {
		if ($(this).css("border-right-width") == "10px") {
			loc_extrema_options.push($(this).val());
		}
	});

	// Collects selected volatility regions algorithm values
	var vol_regions_options = [];
	$("#vol-options").children().each(function() {
		if ($(this).css("border-right-width") == "10px") {
			vol_regions_options.push($(this).val());
		}
	});



	// Sets up SVG elements



	// Clears the display and adds loading animation
	$("#display").empty();
	$("#display").append('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');

	// Sets the dimensions of the canvas / graph
	var max_x = $("#display").width();
	var max_y = $("#display").height();
	margin = {top: 20, right: 180, bottom: 30, left: 80};
	width = max_x - margin.left - margin.right;
	height = max_y - margin.top - margin.bottom - 20;

	// console.log(width);
	// console.log(height);
	// console.log(margin);

	// Sets the date parsing function
	var parseDate = d3.time.format("%Y-%m-%d").parse;

	// Set the ranges
	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	// Assigns colors to ordinal scale
	// NOTE: Only range is set here; domain is specified after data is loaded
	// var color = d3.scale.category10();
	var color = d3.scale.ordinal().range(["#4CAF50", "#94BAFF", "#FF9696", "#FFDC9C", "#CEADFF"]);

	// Define the axes
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// Define the line
	var line = d3.svg.line()
		// Makes lines curvy
		.interpolate("basis")
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.close); });



	// Gets the data

	var request_data = {"start_date": start_date, "end_date": end_date, "train_date": train_date, "algorithms": algorithms, "options": options,
						"abs_extrema_options": abs_extrema_options, "loc_extrema_options": loc_extrema_options, "vol_regions_options": vol_regions_options};

	// NOTE: make sure to stringify objects before sending request
	d3.json("/ajax/get_data/").post(JSON.stringify(request_data), function(error, all_data) {
		if (error) return console.warn(error);

		// gets price data
		var data = all_data["data"];
		var abs_min = all_data["abs_min"];
		var abs_max = all_data["abs_max"];
		var loc_min = all_data["loc_min"];
		var loc_max = all_data["loc_max"];
		var low_vol = all_data["low_vol_regions"];
		var high_vol = all_data["high_vol_regions"];

		// Sorts the data by descending date (later date --> larger index)
		data.sort(function(a, b) {
			return new Date(a.date) - new Date(b.date);
		});



		// Uses the data

		// Clears the display
		$("#display").empty();

		// Adds the svg canvas and its inner g element (variable svg is the g element)
		var svg = d3.select("#display").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Applies the color scale to the domain (price at point in time)
		// NOTE: Must use "!= date" since prices have different names depending on the dictionary
		color.domain(d3.keys(data[0]).filter(function(key) { return key != "date"; }));

		// Parses the dates from each dictionary in the data
		data.forEach(function(d) {
			d.date = parseDate(d.date);
		});

		// Maps each algorithm to a different color in the color scale
		var algorithms = color.domain().map(function(name) {
			return {
				name: name,
				values: data.map(function(d) {
					return {date: d.date, close: d[name]};
				})
			};
		});

		// Scale the domains of the data
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

		// Add the algorithm svg element (container) and its associated data
		var algorithm = svg.selectAll("algo")
			.data(algorithms)
		.enter().append("g")
			.attr("class", "algo");

		// Adds path between data points
		algorithm.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

		// Adds algorithm's text (text appears .35em above and 3px to the right of the end)
		algorithm.append("text")
			.datum(function(d) { return {name: full_algo_name(d.name), value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.close) + ")"; })
			.attr("x", 3)
			.attr("dy", ".3em")
			.text(function(d) { return d.name; });



		// Functions for adding extrema
		absolute_extrema(abs_min, abs_max, abs_extrema_options, svg, x, y, parseDate);
		local_extrema(loc_min, loc_max, loc_extrema_options, svg, x, y, parseDate);

		// Functions for adding volatility regions
		vol_regions(low_vol, high_vol, vol_regions_options, svg, x, parseDate);


		// Formatting functions
		var formatValue = d3.format(",.2f");
		var formatCurrency = function(d) { return "$" + formatValue(d); };

		// Bisection function - returns index of array nearest to current x
		var bisectDate = d3.bisector(function(d) {
			return d.date;
		}).left;

		// Bisects the mouse's x position to obtain the nearest value in the data array
		function getNearestX(elem, offset) {
			if (offset == null) offset = 0;
			// Finds date at mouse
			var x0 = x.invert(d3.mouse(elem)[0] - offset);
			// Gets bisection (index) of date at mouse
			var i = bisectDate(data, x0, 1);
			// Gets date immediately before mouse and compares to date at mouse to see which one is closer
			var d0 = data[i - 1];
			var d1 = data[i];
			if (d0 === undefined || d1 === undefined) {
				return null;
			}
			var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
			return d;
		}



		// Vertical line that moves with mouse
		var vertical = d3.select("#display")
			.append("div")
			.attr("class", "remove vertical")
			.style("position", "absolute")
			.style("z-index", "19")
			.style("width", "1px")
			.style("height", height + "px")
			.style("top", margin["top"] + "px")
			.style("bottom", "30px")
			.style("left", "80px")
			.style("margin-left", "30%")
			.style("background", "#555");

		// Mouse event listeners on display
  		d3.select("#display")
			.on("mousemove", function() {

				var d = getNearestX(this, 80);
				// If mouse is not inside display
				if (d3.mouse(this)[0] < 80 || d == null) return;

				d3.selectAll(".vertical").classed("hidden", false);
				d3.selectAll(".focus").classed("hidden", false);

				// Updates the tooltip position and value
				d3.select("#tooltip")
					.style("left", d3.mouse(this)[0] + 20 + "px")
					.style("top", d3.mouse(this)[1] - 50 + "px")
					.classed("hidden", false);
				d3.select("#tooltip-date")
					.text($.format.date(d.date, "ddd MMM d, yyyy"));
				// Removes any old tooltip algorithm divs
				$(".tooltip-algorithm").remove();
				// Loops through each algorithm in data object to show each one's price
				for (var key in d) {
					if (d.hasOwnProperty(key)) {
						if (key != "date") {
							$("#tooltip").append('<div class="tooltip-algorithm" id="tooltip-algorithm-' + key + '"</div>');
							$("#tooltip-algorithm-" + key).append("<p>" + full_algo_name(key) + "</p>");
							$("#tooltip-algorithm-" + key).append("<p>" + formatCurrency(d[key]) + "</p>");
						}
					}
				}

				// Updates the vertical bar
				mousex = d3.mouse(this)[0];
				vertical.style("left", mousex + "px");
			})
			.on("mouseout", function() {
				d3.select("#tooltip").classed("hidden", true);
				d3.selectAll(".vertical").classed("hidden", true);
				d3.selectAll(".focus").classed("hidden", true);
			});



		// Focus that displays circle at intersection of chart and vertical line
		var foci = [];
		var focus;
		for (var i = 0; i < algorithms.length; i++) {
			focus = svg.append("g")
				.attr("class", "focus")
				.style("display", "none")
			foci.push(focus);
			focus.append("circle")
				.attr("r", 4.5);
		}

		svg.append("rect")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mouseover", function() {
				for (var i = 0; i < foci.length; i++) {
					foci[i].style("display", null);
				}
			})
			.on("mouseout", function() {
				for (var i = 0; i < foci.length; i++) {
					foci[i].style("display", null);
				}
			})
			.on("mousemove", function() {
				var d = getNearestX(this);
				if (d == null) return;
				// Note: Use x(d.date) for x translation if the point needs to be exactly on the date
				// This implementation forces the focus circle to always follow the mouse (in sync with vertical line)
				var i = 0;
				for (var key in d) {
					if (d.hasOwnProperty(key)) {
						if (key != "date") {
							foci[i].attr("transform", "translate(" + d3.mouse(this)[0] + "," + y(d[key]) + ")");
							i++;
						}
					}
				}
			});
	});
}



// Adds absolute extrema to the visualization
// The for loop goes through all algorithms where absolute extrema are enabled
function absolute_extrema(abs_min, abs_max, abs_extrema_options, svg, x, y, parseDate) {

	var algo;

	// Absolute Minima
	for (var i = 0; i < abs_extrema_options.length; i++) {

		algo = ALGO_NAMES[abs_extrema_options[i]];

		var node = svg.selectAll("node")
			.data(abs_min[algo])
				.enter().append("g")
			.attr("class", "node");

		node.append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(parseDate(d.date)); })
			.attr("cy", function(d) { return y(d[algo]); });

		node.append("text")
			.datum(function(d) {
				return {text: "Absolute Minimum", date: parseDate(d.date), [algo]: d[algo]};
			 })
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d[algo]) + ")"; })
			.attr("x", 8)
			.attr("dy", ".3em")
			.text(function(d) { return d.text; });
	}

	// Absolute Maxima
	for (var i = 0; i < abs_extrema_options.length; i++) {

		algo = ALGO_NAMES[abs_extrema_options[i]];

		var node = svg.selectAll("node")
			.data(abs_max[algo])
				.enter().append("g")
			.attr("class", "node");

		node.append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(parseDate(d.date)); })
			.attr("cy", function(d) { return y(d[algo]); });

		node.append("text")
			.datum(function(d) {
				return {text: "Absolute Maximum", date: parseDate(d.date), [algo]: d[algo]};
			 })
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d[algo]) + ")"; })
			.attr("x", 8)
			.attr("dy", ".3em")
			.text(function(d) { return d.text; });
	}
};

// Adds local extrema to the visualization
// The for loop goes through all algorithms where local extrema are enabled
function local_extrema(loc_min, loc_max, loc_extrema_options, svg, x, y, parseDate) {

	var algo;

	// Local Minima
	for (var i = 0; i < loc_extrema_options.length; i++) {

		algo = ALGO_NAMES[loc_extrema_options[i]];

		var node = svg.selectAll("node")
			.data(loc_min[algo])
				.enter().append("g")
			.attr("class", "node");

		node.append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(parseDate(d.date)); })
			.attr("cy", function(d) { return y(d[algo]); });

		node.append("text")
			.datum(function(d) {
				return {text: "Local Minimum", date: parseDate(d.date), [algo]: d[algo]};
			 })
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d[algo]) + ")"; })
			.attr("x", 8)
			.attr("dy", ".3em")
			.text(function(d) { return d.text; });
	}

	// Local Maxima
	for (var i = 0; i < loc_extrema_options.length; i++) {

		algo = ALGO_NAMES[loc_extrema_options[i]];

		var node = svg.selectAll("node")
			.data(loc_max[algo])
				.enter().append("g")
			.attr("class", "node");

		node.append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(parseDate(d.date)); })
			.attr("cy", function(d) { return y(d[algo]); });

		node.append("text")
			.datum(function(d) {
				return {text: "Local Maximum", date: parseDate(d.date), [algo]: d[algo]};
			 })
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d[algo]) + ")"; })
			.attr("x", 8)
			.attr("dy", ".3em")
			.text(function(d) { return d.text; });
	}
};



// Draws regions on graph of high and low volatility
function vol_regions(low_vol_regions, high_vol_regions, vol_regions_options, svg, x, parseDate) {

	// Low volatility regions
	for (var i = 0; i < vol_regions_options.length; i++) {

		algo = ALGO_NAMES[vol_regions_options[i]];

		var region = svg.selectAll("region")
			.data(low_vol_regions[algo])
				.enter().append("g")
			.attr("class", "region")
			.attr("class", "low_vol_region");

		region.append("rect")
			.attr("x", function(d) {
				return x(parseDate(d.start));
			 })
			.attr("y", function(d) { return margin.top - 20; })
			.attr("width", function(d) { return x(new Date(d.end)) - x(new Date(d.start)); })
			.attr("height", height);

	}

	// High volatility regions
	for (var i = 0; i < vol_regions_options.length; i++) {

		algo = ALGO_NAMES[vol_regions_options[i]];

		var region = svg.selectAll("region")
			.data(high_vol_regions[algo])
				.enter().append("g")
			.attr("class", "region")
			.attr("class", "high_vol_region");

		region.append("rect")
			.attr("x", function(d) {
				return x(parseDate(d.start));
			 })
			.attr("y", function(d) { return margin.top - 20; })
			.attr("width", function(d) { return x(new Date(d.end)) - x(new Date(d.start)); })
			.attr("height", height);

	}
}
