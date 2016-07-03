
# Returns results in format:
# {"DATE": "__DATE__", "ACTUAL": __MIN_PRICE__}, {"DATE": "__DATE__", "ACTUAL": __MAX_PRICE__}
def abs_min_max(data, algo_code):

	data_max = data[0]
	data_min = data[0]
	for dct in data:
		if dct[algo_code] > data_max[algo_code]:
			data_max = dct
		if dct[algo_code] < data_min[algo_code]:
			data_min = dct

	return [data_min, data_max]



if __name__ == "__main__":
	import get_data as gd
	all_data = gd.get_hist_sp("1997-1-1", "1997-2-1")

	print abs_min_max(all_data, "actual")
