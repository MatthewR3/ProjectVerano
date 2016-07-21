
import get_data as gd



# Returns results in format:
# Note that start date and end date will be in individual lists within the list of high or low volatility
# {"high_vol="Start": "__DATE__", "End": "__Date__"}, {"low_vol = "Start": "__DATE__", "End": __DATE__"}

# Essentially, this function looks to see if the index differs by more than 0.5% from the previous day's price (this percentage could
# obviously be adjusted). When it does differ by more than the set percentage, we consider it to have high volatility. We record
# it as one day of high volatility, hence the i and j's. If we get to 3 days in a row of this behavior, the program is written so
# that the next time it doesn't differ by the set percentage (low volatility), then the start_date and previous_date are recorded
# as the date range of high volatility. The start_date is then rest and the procedure starts over. It works the same for consecutive
# days of low volatility



def low_high_vol(start_date, end_date, train_date):
	all_data = gd.get_hist_sp(start_date, end_date)
	#print all_data
	train_data = gd.get_hist_sp(start_date, train_date)
	#print train_data

	low_vol = [] # list of lists
	high_vol = [] # list of lists
	temp_low = [] # temporary list that will hold start and end date
	temp_high = [] # same as above
	undeter = [] # Dates where low volatility or high volatility doesn't persist for minimum of 3 days


	# Will be used as start date for range, previous date will be used to test for volatility day by day
	start_date = all_data[0]
	previous_date = all_data[0]

	# Tallies that will be used to keep track of days in a row (remember, must get to 3)
	i = 0 # will be used for low volatility
	j = 0 # WIll be used for high volatility


	for dct in all_data:

		diff = dct["actual"] - previous_date["actual"] # Difference in index value from one day to the next
		tol = previous_date["actual"] * .005 # The determing factor is a change of more than 1% from the previous day

		if abs(diff) > tol: # would indicate high volatility
			j = j + 1
			if i > 0:
				if i > 2:
					temp_low.append(start_date["date"])
					temp_low.append(dct["date"])
					low_vol.append(temp_low)
					temp_low = []
				i = 0
				start_date = dct
		else:
			i = i + 1

			if j > 0:

				if j > 2:
					temp_high.append(start_date["date"])
					temp_high.append(dct["date"])
					high_vol.append(temp_high)
					temp_high = []

				j = 0
				start_date = dct

		previous_date = dct

	return low_vol, high_vol




if __name__ == "__main__":
	print low_high_vol("1995-1-1", "1995-3-1", "1995-2-1")
