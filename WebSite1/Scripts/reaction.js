function Reaction(initStr) {
	var productRegex = /([\+\-])\s*([^\s\+\-]+)/gi;
	var digitRegex = /([a-z])(\d+)/gi;
	var s = initStr.replace(digitRegex, "$1<sub>$2</sub>");
	var i1 = s.indexOf(".");
	var i2 = s.indexOf("->");
	this.categoryId = s.slice(0, i1);
	this.reagents = s.slice(i1+1, i2).trim();
	var prodPart = "+ "+s.slice(i2+2).trim();
	this.totalRealProducts = prodPart.match(/\+/g).length;
	this.products = shuffle(prodPart.replace(productRegex, "$1 $2").match(productRegex));
	this.productsStr = "";
	this.selectedRealProducts = 0;
	this.selectedFakeProducts = 0;
	
	this.isSomeProductSelected = function() {
		return this.selectedFakeProducts > 0 || this.selectedRealProducts > 0;
	}

	this.addProduct = function (prodId) {
		if (this.productsStr.length > 0) this.productsStr += " + ";
		this.productsStr += this.getProductStr(prodId);
		if (this.isFakeProduct(prodId)) {
			++this.selectedFakeProducts;
		} else {
			++this.selectedRealProducts;
		}
	}

	this.removeProduct = function (prodId) {
		this.productsStr = this.productsStr
			.replace(new RegExp("([^\>a-zA-Z0-9]|^)" + this.getProductStr(prodId) + "([^\<a-zA-Z0-9]|$)"), "$1$2")
			.replace(/\s+?\+\s+?$/, "")
			.replace(/\s+?\+\s+?\+\s+?/, " + ")
			.replace(/^\s+?\+\s+?/, "");
		if (this.isFakeProduct(prodId)) {
			--this.selectedFakeProducts;
		} else {
			--this.selectedRealProducts;
		}
	}

	this.getProductStr = function (prodId) {
		var prod = this.products[prodId];
		var idx = prod.search(/[A-Z]/g);
		return prod.slice(idx)
	}

	this.isFakeProduct = function(prodId) {
		return this.products[prodId].charAt(0) == "-";
	}

	this.getText = function() {
		return this.reagents + " -> " + this.productsStr;
	}

	this.getElements = function(str) {
		return str.match(/[A-Z][a-z]?/g);
	}

	this.getValidationErrors = function() {
		var validationErrors = [];

		if (this.selectedFakeProducts <= 0 && this.selectedRealProducts <= 0) {
			validationErrors.push("Выберите продукты реакции из списка.");

		} else if (this.productsStr && this.reagents) {
			var arrReagents = this.getElements(this.reagents);
			var arrProd = this.getElements(this.productsStr);

			if (arrReagents && arrProd) {		
				var missingProducts = getMissingElements(arrProd, arrReagents);
				var redundantProducts = getMissingElements(arrReagents, arrProd);

				if (missingProducts.length) {
					//validationErrors.push("Не все исходные химические элементы найдены среди продуктов реакции.");
					validationErrors.push("Среди продуктов реакции не найдены следующие химические элементы: " + missingProducts.join(", "));
				}
				if (redundantProducts.length) {
					validationErrors.push("Обнаружены лишние химические элементы среди продуктов реакции: " + redundantProducts.join(", "));
				}
			}
			if (validationErrors.length == 0) 
			{
				if (this.selectedFakeProducts > 0) {
					validationErrors.push("Выбраны вещества, которые не синтезируются в результате этой реакции!");
				};
				if (this.selectedRealProducts < this.totalRealProducts) {
					validationErrors.push("Не все продукты реакции выбраны.");
				}
			}
		}
		return validationErrors;
	}
}