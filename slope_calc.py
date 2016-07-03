
# NOTE: Uses "point_slope" as code as "slope" is already used by slope analysis
def slope(data, algo_code):

	prices = []
	# Sets up an empty list to store values of dct("actual")
	list1 = []

	# Adds values of dct[algo_code] to the list
	for dct in all_data:
		list1.append(dct[algo_code])

	# Will be used for indices of list
	n = 0
	for dct in data:
		# Slope for first and last day in given range will be 0
		if (n == 0) or (n == len(list1)-1):
			dct["point_slope"] = 0
		else:
			# Calculates slope based on day before and day after
			dct["point_slope"] = (list1[n - 1] - list1[n + 1]) / 2
		n = n + 1

	return data




if __name__ == "__main__":
	import get_data as gd
	all_data = gd.get_hist_sp(start_date, end_date)
	print slope("1995-1-1", "1995-3-1", "1995-2-1")
