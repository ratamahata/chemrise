function Reaction(initStr) {
	var productRegex = /[\+\-]\s*[^\s\+\-]+/gi;
	var digitRegex = /([a-z])(\d+)/gi;
	var s = initStr.replace(digitRegex, "$1<sub>$2</sub>");
	var i1 = s.indexOf(".");
	var i2 = s.indexOf("->");
	this.categoryId = s.slice(0, i1);
	this.reagents = s.slice(i1+1, i2).trim();
	this.products = shuffle(("+"+s.slice(i2+2).trim()).match(productRegex));

	this.productsStr = "";

	this.addProduct = function (prodId) {
		if (this.productsStr.length > 0) this.productsStr += " + ";
		this.productsStr += this.getProductStr(prodId);
	}

	this.removeProduct = function (prodId) {
		this.productsStr = this.productsStr
			.replace(new RegExp("([^\>a-zA-Z0-9]|^)" + this.getProductStr(prodId) + "([^\<a-zA-Z0-9]|$)"), "$1$2")
			.replace(/\s+?\+\s+?$/, "")
			.replace(/\s+?\+\s+?\+\s+?/, " + ")
			.replace(/^\s+?\+\s+?/, "");
	}

	this.getProductStr = function (prodId) {
		var prod = this.products[prodId];
		var idx = prod.search(/[a-z0-9]/gi);
		return prod.slice(idx)
	}

	this.getText = function() {
		return this.reagents + " -> " + this.productsStr;
	}
}