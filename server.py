from flask import Flask
from flask import render_template
from flask import request
import json

import get_data as gd
import algorithms as algo

app = Flask(__name__)



@app.route("/")
def demo():
    return render_template("demo.html")



@app.route("/ajax/get_data/", methods=["POST"])
def get_all_data():
	# Converts request.data (JSON string) to python dict
	params = json.loads(request.data)
	#print params
	start_date = params["start_date"]
	end_date = params["end_date"]
	train_date = params["train_date"]
	algorithms = params["algorithms"]
	print algorithms

	actual_data = gd.get_hist_sp(start_date, end_date)
	# Actual Performance - code: actual
	if 0 in algorithms:
		print 0
		data = actual_data
	# Slope Analysis - code: slope
	if 1 in algorithms:
		algo_data = algo.slope(start_date, end_date, train_date)
		data = gd.combine_data(data, algo_data)
	# Peak / Trough Analysis
	if 2 in algorithms:
		pass
	# Moving Average
	if 3 in algorithms:
		pass

	# Basic test data
	# data = [{"date": "1995-01-01", "close": 500, "1": 600}, {"date": "1995-01-02", "close": 510, "1": 610}, {"date": "1995-01-03", "close": 520, "1": 620}]

	#print json.dumps(data)
	return json.dumps(data)



if __name__ == '__main__':
    app.run(debug=True)