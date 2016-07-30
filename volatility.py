# TODO: Change to this format
# Returns results in format:
# low_vol = [{"start": __DATE__, "end": __DATE__}, {...}, ...], high_vol = [{"start": __DATE__, "end": __DATE__}, {...}, ...]

# Current format:
# NOTE: Start date and end date will be in individual lists within the list of high or low volatility
# low_vol = [[__DATE__, __DATE__], [...], ...], high_vol = [[__DATE__, __DATE__], [...], ...],


# Essentially, this function looks to see if the index differs by more than 0.5% from the previous day's price (this percentage could
# obviously be adjusted). When it does differ by more than the set percentage, we consider it to have high volatility. We record
# it as one day of high volatility, hence the i and j's. If we get to 3 days in a row of this behavior, the program is written so
# that the next time it doesn't differ by the set percentage (low volatility), then the start_date and previous_date are recorded
# as the date range of high volatility. The start_date is then reset and the procedure starts over. It works the same for consecutive
# days of low volatility.



def low_high_vol(all_data, algo_code):

	low_vol = [] # TODO: List of lists - ...that holds what?
	high_vol = [] # TODO: List of lists - ...that holds what?
	temp_low = [] # Temporary list that will hold high volatility start and end dates
	temp_high = [] # Temporary list that will hold low volatility start and end dates
	undeter = [] # TODO: Dates where low volatility or high volatility doesn't persist for minimum of 3 days - This is unused?


	# Will be used as start date for range, previous date will be used to test for volatility day by day
	start_date = all_data[0]
	previous_date = all_data[0]

	# Tallies for keeping track of days in a row (remember, must get to 3)
	i = 0 # Low volatility
	j = 0 # High volatility


	for dct in all_data:

		# Difference in index value from one day to the next
		diff = dct[algo_code] - previous_date[algo_code]
		# Tolerance: volaility is a change of more than .5% from the previous day
		# TODO: >1% daily change may indicate high volatility, but what indicates low volatility? There's no differentiation here.
		#     I would also suggest allowing the user to define the threshold or have it dynamically calculated somehow. Magic numbers are bad.
		# tol = previous_date[algo_code] * .005
		tol = previous_date[algo_code] * .005

		# High volatility
		if abs(diff) > tol:
			j = j + 1
			if i > 0:
				if i > 2:
					temp_low.append(start_date["date"])
					temp_low.append(dct["date"])
					low_vol.append(temp_low)
					temp_low = []
				i = 0
				start_date = dct
		# TODO: This could be either low volatility or undetermined - rework to differentiate
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
	import get_data as gd
	all_data = gd.get_hist_sp("1995-1-1", "1995-2-1")

	print low_high_vol(all_data, "actual")



# NOTES ON CURRENT IMPLEMENTATION
# 1. The returned data needs to be explicitly stated. I put an example in the footnotes of the file of how it should be formatted,
#     and that ignored in favor of a different format that was more confusing and harder to work with (the list of lists).
# 2. Unless you're initializing a variable with a short value, put comments directly above the line it's on. You can compare the ones
#     I fixed above with each other to see what I mean.
# 3. Check your code afterwards for unused variables and redundant code. Both are natural, but should be removed at the end. In this case,
#     you had/have a few unused variables (train_date and undeter).
# 4. Make variable names concise but semantically useful. i, j, k, x, y are all well and good for places where they are temporary or are
#     used for a self-explanatory purpose (such as in for loops, where I usually use x), but in this case I would use a better name for
#     i and j. I let this go in the past two files, but this time it's harder to decipher their meaning.
# 5. Remember to think about how this script fits into the program. In the beginning, you called gd.get_hist_sp() to get the data. But what
#     if we wanted to get the volatility of something other than S&P 500 data? So I moved that down to the testing clause and let your function
#     take arbitrary data and an algo_code as an input. I did this with your other scripts, too (read through those). Always make your code extensible.
# 6. Unless I'm missing something, the temp lists are only used to load in data and immediately unload it. This seems unnecessary and resource-intensive.



# CRITIQUE ON CURRENT IMPLEMENTATION
# 1. Volatility should be a consistent zone. You'll want to do some smoothing within your algorithm, because sometimes it will pick up
#     multiple LV regions separated by a very small HV region. While sometimes these hiccups are valid HV regions, many times you'll just
#     want to ignore them if they're barely above the threshold. You can do this through a function at the end or build it into your algorithm.
# 2. Is 3 days long enough in every scenario? What if we're looking at 50 years worth of daily-recorded data? A tiny little bar on the graph doesn't
#     tell you much in the context of the graph. This may be another solution to the smoothing problem I described in the last point.
# 3. Most implementations I've seen of volatility detectors use some kind of point-building system. When there's low volatility, you deduct points
#     proportionate to the magnitude of volatility (or lack thereof) and when there's high volatility you add points. Then there are point
#     thresholds that determine when a region starts and ends. They typically use a combination of immediate factors (daily price comparison, like
#     you did in yours) and this point system to mark off the barriers. You may want to consider doing something similar.
