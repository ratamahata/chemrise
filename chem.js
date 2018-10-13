//alert("hello");

var categories = [
	"Галогены",//0
	"O2",//1
	"Cr"]//2

var reactions = { raw : [
	"0. KMnO4 + KNO2 + H2O -> MnO4 + KNO3 + KOH - K2MnO4 - O2 - H2 - H20"//0
]}

function parseReactions() {
	reactions.parsed = [];
	for (r in reactions.raw) {
		var obj = {};
		var s = reactions.raw[r];
		var i1 = s.indexOf(".");
		var i2 = s.indexOf("->");
		obj.categoryId = s.slice(0, i1);
		obj.reagents = s.slice(i1+1, i2).trim();
		reactions.parsed.push(obj);
	}
}

function cloneElement(elClassName, arrStrings, initFunc) {
	var el = $("." + elClassName);
	var last = el;
	for (str in arrStrings) {
		var cloned = el.clone(false);
		if (initFunc(cloned, str)) {
			last.after(cloned);
			last = cloned;
		}
	}
}

function switchCategory(catId) {
	//alert(id);	
	$(".reaction:visible").remove();
	cloneElement("reaction", reactions.parsed, function(el, reactId) {
		var reaction = reactions.parsed[reactId];
		if (~catId && reaction.categoryId != catId) return false;
		el.html(reaction.reagents);
		el.show();
		return true;
	});
}

// Shorthand for $( document ).ready()
$(function() {
	parseReactions();
	$(".category").click(function() {
		switchCategory(-1);
	});
	cloneElement("category", categories, function(el, id) {
		el.html(categories[id]);
		el.click( function() {
			switchCategory(id);
		})
		return true;		
	});
});
