function Reaction(initStr) {
	var productRegex = /[\+\-]\s*[^\s\+\-]+/gi;
	var digitRegex = /([a-z])(\d+)/gi;
	var s = initStr.replace(digitRegex, "$1<sub>$2</sub>");
	var i1 = s.indexOf(".");
	var i2 = s.indexOf("->");
	this.categoryId = s.slice(0, i1);
	this.reagents = s.slice(i1+1, i2).trim();
	this.products = shuffle(("+"+s.slice(i2+2).trim()).match(productRegex));

	this.getProductStr = function (prodId) {
		var prod = this.products[prodId];
		var idx = prod.search(/[a-z0-9]/gi);
		return prod.slice(idx)
	}
}