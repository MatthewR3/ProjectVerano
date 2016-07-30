from flask import Flask
from flask import render_template
from flask import request
import json

import get_data as gd
import algorithms as algo
import abs_min_max
import loc_min_max
import volatility

app = Flask(__name__)



@app.route("/")
def demo():
    return render_template("demo.html")



# Variable index:
# all_data - combined response data
#     data - combination of actual and algorithm data
#         actual_data - actual performance of S&P 500
#         algo_data - performance of a particular algorithm
#     abs_min - absolute minimum
#     abs_max - absolute maximum
#     loc_min - collection of local minimums
#     loc_max - collection of local maximums
@app.route("/ajax/get_data/", methods=["POST"])
def get_all_data():

	# TODO: Allow this to be changed in interface (200 best suits default date range)
	local_threshold = 200

	# Converts request.data (JSON string) to python dict
	params = json.loads(request.data)

	start_date = params["start_date"]
	end_date = params["end_date"]
	train_date = params["train_date"]
	algorithms = params["algorithms"]
	options = params["options"]
	abs_extrema_options = params["abs_extrema_options"]
	loc_extrema_options = params["loc_extrema_options"]
	vol_regions_options = params["vol_regions_options"]

	data = []
	actual_data = gd.get_hist_sp(start_date, end_date)
	# Actual Performance - code: actual
	if 0 in algorithms:
		data = actual_data
	# Slope Analysis - code: slope_analysis
	if 1 in algorithms:
		algo_data = algo.slope_analysis(start_date, end_date, train_date)
		data = gd.combine_data(data, algo_data)
	# Peak / Trough Analysis - code: pt_analysis
	if 2 in algorithms:
		pass
	# Moving Average - code: moving_avg
	if 3 in algorithms:
		pass



	#OPTIONS

	loc_min = {}
	loc_max = {}
	abs_min = {}
	abs_max = {}
	low_vol_regions = {}
	high_vol_regions = {}

	# Absolute extrema
	if 0 in options:
		# Keeps track of algorithm names
		names = ["actual", "slope_analysis", "pt_analysis", "moving_avg"]
		for num in abs_extrema_options:
			abs_min_max_val = abs_min_max.abs_min_max(data, names[num])
			abs_min[names[num]] = [abs_min_max_val[0]]
			abs_max[names[num]] = [abs_min_max_val[1]]

	# Local extrema
	if 1 in options:
		names = ["actual", "slope_analysis", "pt_analysis", "moving_avg"]
		for num in loc_extrema_options:
			loc_min_max_val = loc_min_max.loc_min_max(data, names[num], local_threshold)
			loc_min[names[num]] = loc_min_max_val[0]
			loc_max[names[num]] = loc_min_max_val[1]

		# Loops through local mins and maxes and removes the absolute mins and maxes if they share a point (prevents overlapping on graph)
		# The try clauses make sure the absolute extrema's key is in the local extrema's dict. This is sometimes not the case.
		if 0 in options:
				for abs_key, abs_min_val in abs_min.iteritems():
					try:
						for abs_min_val in abs_min[abs_key]:
							for loc_min_val in loc_min[abs_key]:
								if abs_min_val == loc_min_val:
									# print "REMOVING MIN"
									loc_min[abs_key].remove(loc_min_val)
					except:
						pass
				for abs_key, abs_max_val in abs_max.iteritems():
					try:
						for abs_max_val in abs_max[abs_key]:
							for loc_max_val in loc_max[abs_key]:
								if abs_max_val == loc_max_val:
									# print "REMOVING MAX"
									loc_max[abs_key].remove(loc_max_val)
					except:
						pass

	if 2 in options:
		print "Volatility detected"
		names = ["actual", "slope_analysis", "pt_analysis", "moving_avg"]
		for num in vol_regions_options:
			low_vol, high_vol = volatility.low_high_vol(data, names[num])

			# TODO: When volatility.py is converted to the new format, comment these next two blocks out to see if it shows on the graph
			new_low_vol = []
			for x in low_vol:
				end_date = x[0]
				start_date = x[1]
				new_low_vol.append({"start": start_date, "end": end_date})

			new_high_vol = []
			for x in high_vol:
				end_date = x[0]
				start_date = x[1]
				new_high_vol.append({"start": start_date, "end": end_date})

			print low_vol
			print high_vol
			print ""
			print new_low_vol
			print new_high_vol

			# TODO: Also change these to just low_vol and high_vol
			low_vol_regions[names[num]] = new_low_vol
			high_vol_regions[names[num]] = new_high_vol




	all_data = {"data": data, "abs_min": abs_min, "abs_max": abs_max, "loc_min": loc_min, "loc_max": loc_max,
				"low_vol_regions": low_vol_regions, "high_vol_regions": high_vol_regions}

	return json.dumps(all_data)



if __name__ == '__main__':
	app.run(debug=True)
