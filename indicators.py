# All dates should use format YYYY-MM-DD

# Data obtained from get_data is in the format of:
#	[{"date": STRING, "ALGO_CODE": FLOAT}, {"date": STRING, "ALGO_CODE": FLOAT}, ...]
# The algorithm should return a boolean value (true for price increase or false for price decrease)



'''
This indicator uses volatility to determine whether the price will increase / decrease on the target date. The following intuition is useful:
	1. If the data has experienced HV, it will typically reverse its direction in the short term.
	2. If the data has experienced LV, it will typically maintain its course in the short term.
	3. In the long term, volatility has little impact on course (it will always go up).
	4. The longer the period of volatility, the larger the reverse will be.
'''
def vol(data, algo_code, target_date):
	return True



if __name__ == "__main__":
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data

	print vol(train_data)
