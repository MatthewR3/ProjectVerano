import get_data as gd


def slope(start_date, end_date, train_date):
	all_data = gd.get_hist_sp(start_date, end_date)
	# print all_data
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data
	prices = []
	# for keys, vals in enumerate(train_data):
	# 	prices.append(vals["actual"])
	# print prices

	# Changes key name and adds 10 to value
	list1=[] #Set up an empty list to store values of dct("actual")

	for dct in all_data:

		list1.append(dct["actual"]) #Add values of dct["actual"] to the list

	n= 0 # Will be used for indices of list

	for dct in all_data:
		if (n == 0) or (n == len(list1)-1): #Slope for first and last day in given range will be 0
			dct["slope"] = 0
		else:
			dct["slope"] = (list1[n-1] - list1[n+1])/2 #Calculates slope based on day before and day after
		n = n +1


	return all_data




if __name__ == "__main__":
	print slope("1995-1-1", "1995-3-1", "1995-2-1")
