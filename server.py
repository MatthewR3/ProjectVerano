from flask import Flask
from flask import render_template
from flask import request
import json

import get_data as gd

app = Flask(__name__)



@app.route("/")
def demo():
    return render_template("demo.html")



@app.route("/ajax/get_data/", methods=["POST"])
def get_sp_data():
	start_date = "2016-05-10"
	end_date = "2016-05-20"
	# Converts request.data (JSON string) to python dict
	params = json.loads(request.data)
	#print params
	start_date = params["start_date"]
	end_date = params["end_date"]
	data = gd.get_hist_sp(start_date, end_date)
	#print json.dumps(data)
	return json.dumps(data)



if __name__ == '__main__':
    app.run(debug=True)