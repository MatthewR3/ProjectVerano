# The following function allows the user to choose a tolerance for which to validate weather a peak or trough
# is actually a local min or max. To test a point's validity, we establish two boundares:
#
#     Boundary 1 is placed before the local min or max. It will usually be the local min / max, or the starting point.
#     The next local min/max must drop below or exceed this boundary by the tolerance to become a potential local max or min.
#     At this point, we continue to move along the graph.
#
#     Boundary 2 is then set equal to the new local max or min candidate. This boundary changes as we test different points.
#     Once it is below or above our established local max or min by the given tolerance, the function then adds the stored
#     local max/min to its respective list, the boundaries are reset, and the process starts over.

# Returns results in format:
# {"DATE": "__DATE__", "ACTUAL": __MIN_PRICE__}, {"DATE": "__DATE__", "ACTUAL": __MAX_PRICE__}
def loc_min_max(data, algo_code, tolerance):
	# all_data = gd.get_hist_sp(start_date, end_date)
	#print all_data


	# Creates a boundary point to base local mins and maxes off of
	# Boundary 1 is before local min/max, boundary 2 is after
	bound1 = data[0]
	bound2 = bound1
	# Creates empty lists that will contain the date-price dictionaries of local maxes and mins, respectively
	lmax = []
	lmin = []
	# Variables that temporarily store potential local maxes or mins
	local_max = bound1
	local_min = bound1
	for dct in data:
		if dct[algo_code] > local_max[algo_code]:
			local_max = dct
		elif local_max[algo_code] - bound1[algo_code] > tolerance:
			bound2 = dct
			if local_max[algo_code] - bound2[algo_code] > tolerance:
				lmax.append(local_max)
				bound1 = local_max
				local_min = bound2
				local_max = local_min
		elif dct[algo_code] < local_min[algo_code]:
			local_min = dct
		elif bound1[algo_code] - local_min[algo_code] > tolerance:
			bound2 = dct
			if bound2[algo_code] - local_min[algo_code] > tolerance:
				lmin.append(local_min)
				bound1 = local_min
				local_min = bound2
				local_max = local_min


	return [lmin, lmax]





if __name__ == "__main__":
	import get_data as gd
	all_data = gd.get_hist_sp("1997-1-1", "1997-2-1")

	print loc_min_max(all_data, "actual", 2)
