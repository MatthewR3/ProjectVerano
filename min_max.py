import get_data as gd



# Returns results in format:
# {"DATE": "__DATE__", "ACTUAL": __MIN_PRICE__}, {"DATE": "__DATE__", "ACTUAL": __MAX_PRICE__}
def max_min(start_date, end_date, train_date):
	all_data = gd.get_hist_sp(start_date, end_date)
	#print all_data
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data


	data_max = all_data[0]
	data_min = all_data[0]
	for dct in all_data:
		if dct["actual"] > data_max["actual"]:
			data_max = dct
		if dct["actual"] < data_min["actual"]:
			data_min = dct
	return data_min, data_max





if __name__ == "__main__":
	print max_min("1995-1-1", "1995-3-1", "1995-2-1")
