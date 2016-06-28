import get_data as gd



# Returns results in format:
# {"DATE": "__DATE__", "ACTUAL": __MIN_PRICE__}, {"DATE": "__DATE__", "ACTUAL": __MAX_PRICE__}
def local_max_min(start_date, end_date, train_date, tolerance):
	all_data = gd.get_hist_sp(start_date, end_date)
	#print all_data
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data


	# Creates a boundary point to base local mins and maxes off of
	# Boundary 1 is before local min/max, boundary 2 is after
	bound1 = all_data[0]
	bound2 = bound1
	# Creates empty lists that will contain the dates and prices of local maxes and mins, respectively
	lmax = []
	lmin = []
	#Variables that temporarily store potential local maxes or mins
	local_max = bound1
	local_min = bound1
	for dct in all_data:
		if dct["actual"] > local_max["actual"]:
			local_max = dct
		else:
			if local_max["actual"] - bound1["actual"] > tolerance:
				bound2 = dct
				if local_max["actual"] - bound2["actual"] > tolerance:
					lmax.append(local_max)
					bound1 = local_max
					local_min = bound2
					local_max = local_min
			if dct["actual"] < local_min["actual"]:
				local_min = dct
			else:
				if bound1["actual"] - local_min["actual"] > tolerance:
					bound2 = dct
					if bound2["actual"] - local_min["actual"] > tolerance:
						lmin.append(local_min)
						bound1 = local_min
						local_min = bound2
						local_max = local_min


	return lmax, lmin





if __name__ == "__main__":
	print local_max_min("1997-1-1", "1997-2-1", "1996-2-1", 10)
