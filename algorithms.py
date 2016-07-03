import get_data as gd

# All dates should use format YYYY-MM-DD

# Data obtained from get_data is in the format of:
#	[{"date": STRING, "ALGO_CODE": FLOAT}, {"date": STRING, "ALGO_CODE": FLOAT}, ...]
# This is also the data structure that should be returned by the algorithms

# Algorithms are ordered by their value as displayed in the demo, starting with 1



'''
This algorithm uses the average time between maxes and mins to estimate the frequency of reversals, and it uses the average slope between
	time intervals along maxes and mins to estimate the slope between the maxes and mins
'''
def slope_analysis(start_date, end_date, train_date):
	all_data = gd.get_hist_sp(start_date, end_date)
	# print all_data
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data

	# prices = []
	# for keys, vals in enumerate(train_data):
	# 	prices.append(vals["actual"])
	# print prices

	# Changes key name and adds 50 to value
	for dct in all_data:
		dct["slope_analysis"] = dct.pop("actual") + 50


	return all_data



if __name__ == "__main__":
	print slope("1995-1-1", "1995-3-1", "1995-2-1")
