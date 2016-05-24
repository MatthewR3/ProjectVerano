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
						 "close": float(row[4])},
	f.close()
	return data



# Gets historical price data of a specific share
def get_hist_share(symbol, start_date, end_date):
	share = yf.Share(symbol)
	hist_data = share.get_historical(start_date, end_date)
	return hist_data



if __name__ == "__main__":
	# print get_hist_share("AAPL", "2014-04-25", "2014-04-29")
	print get_hist_sp("2016-05-10", "2016-05-20")