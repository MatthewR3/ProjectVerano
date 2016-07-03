import csv
import time

import yahoo_finance as yf

# All dates should use format YYYY-MM-DD



# Gets historical price data of the S&P 500 by parsing csv file
def get_hist_sp(start_date, end_date):

	with open("sp500.csv", "rb") as f:
		start_date = time.strptime(start_date, "%Y-%m-%d")
		end_date = time.strptime(end_date, "%Y-%m-%d")
		data = []
		reader = csv.reader(f)
		for row in reader:
			# Will throw error on headers
			try:
				date = time.strptime(row[0], "%Y-%m-%d")
			except:
				continue
			# csv is in descending order, so this means it passed range
			if date < start_date:
				break
			if date > start_date and date < end_date:
				data += {"date": row[0],
						 #"open": float(row[1]),
						 "actual": float(row[4])},
	f.close()
	return data



# Gets historical price data of a specific share
def get_hist_share(symbol, start_date, end_date):
	share = yf.Share(symbol)
	hist_data = share.get_historical(start_date, end_date)
	return hist_data



# Combines an arbitrary number of lists containing dictionaries representing price data by date into one
# NOTE: All lists should have the same number of entries and the dictionaries should be in the form as in the examples given below
# Examples:
# [{"date": "1-1-1990", "actual": 100}] + [{"date": "1-1-1990", "mean": 200}] --> [{"date": "1-1-1990", "actual": 100, "mean": 200}]
# [{"date": "1-1-1990", "actual": 100}, {"date": "1-2-1990", "actual": 200}] + [{"date": "1-1-1990", "mean": 300}, {"date": "1-2-1990", "mean": 400}]
# --> [{"date": "1-1-1990", "actual": 100, "mean": 3200}, {"date": "1-2-1990", "actual": 200, "mean": 400}]
def combine_data(*args):
	# Checks to see if arguments' list is empty
	# Uses a non-empty list as original combined (makes sure date is defined)
	for num in range(0, len(args)):
		if args[num] != []:
			combined = args[num]
			break

	for arg in args[num:]:
		for dct in arg:
			dct_algo = dct.items()[1][0]
			dct_value = dct.items()[1][1]
			# O(n^2) runtime - faster way?
			for comb_dct in combined:
				if dct["date"] == comb_dct["date"]:
					comb_dct[dct_algo] = dct_value
	return combined



if __name__ == "__main__":
	# print get_hist_share("AAPL", "2014-04-25", "2014-04-29")
	# print get_hist_sp("2016-05-10", "2016-05-20")
	lst1 = []
	lst2 = [{"date": "1-1-1990", "actual": 100}, {"date": "1-2-1990", "actual": 200}]
	lst3 = [{"date": "1-1-1990", "mean": 300}, {"date": "1-2-1990", "mean": 400}]
	lst4 = [{"date": "1-1-1990", "dev": 300}, {"date": "1-2-1990", "dev": 400}]
	print combine_data(lst1, lst2, lst3, lst4)
	print combine_data(lst4, lst3, lst2, lst1)
