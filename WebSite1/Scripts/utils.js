/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getMissingElements(arr1, arr2) {
	var missingElements = [];
	for(i in arr2) {
		var o = arr2[i];
		if (!arr1.includes(o) && !missingElements.includes(o)) {
			missingElements.push(o);
		}
	}
	return missingElements;
}
