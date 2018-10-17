var categories = [
	"Все реакции",//-1
	"Галогены",//0
	"Сера",//1
	"Азот",//2
	"Фосфор",//3
	"Углерод",//4
	"Кремний"]//5

var reactions = { raw : [
	"2. KMnO4 + KNO2 + H2O -> MnO2 + KNO3 + KOH - K2MnO4 - O2 - H2 - H2O",//0
	"1. SO2 + KMnO4 + H2O -> MnSO4 + K2SO4 + H2SO4 - SO3 - S - H2S - MnO2 - K2MnO4 - KOH - H2O - O2",//1
	"1. SO2 + KMnO4 + KOH -> K2MnO4 +K2SO4 + H2O - H2SO4 - SO3 - S - H2S - MnO2 - O2",//2
	"3. PH3 + KMnO4 + KOH -> K3PO4 + K2MnO4 + H2O - H3PO4 - P4 - P2O5 - MnO2 - O2"//3
]}

var currentCategoryId, currentReactionId;
var cache = {};

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

function parseReactions() {
	var productRegex = /[\+\-]\s*[^\s\+\-]+/gi;
	var digitRegex = /([a-z])(\d+)/gi;
	reactions.parsed = [];
	for (r in reactions.raw) {
		var obj = {};
		var s = reactions.raw[r].replace(digitRegex, "$1<sub>$2</sub>");
		var i1 = s.indexOf(".");
		var i2 = s.indexOf("->");
		obj.categoryId = s.slice(0, i1);
		obj.reagents = s.slice(i1+1, i2).trim();
		obj.products = shuffle(("+"+s.slice(i2+2).trim()).match(productRegex));	
		reactions.parsed.push(obj);
	}
}

function listArrayElements(elClassName, arrStrings, initFunc) {
	$("." + elClassName + ":visible").remove();
	var el = $("." + elClassName);
	var last = el;
	for (str in arrStrings) {
		var cloned = el.clone(false);
		cloned.addClass(elClassName + str)
		if (initFunc(cloned, str)) {
			last.after(cloned);
			cloned.show();
			last = cloned;
		}
	}
}

function listArrayElementsCached(elClassName, id, prevId, arrStrings, initFunc) {
	var parent = $("." + elClassName).parent();
	cache["." + elClassName + prevId] = parent.html();
	var key = "." + elClassName + id;
	var value = cache[key];
	if (typeof value == "string") {
		parent.html(value);
	} else {
		listArrayElements(elClassName, arrStrings, initFunc);
		cache[key] = parent.html();
	}
}

function selectOneItem(elClassName, id, prevId) {
	$("." + elClassName + id).addClass("selected");
	$("." + elClassName + prevId).removeClass("selected");
}

function switchContent(selector, oldId, newId, defaultContent) {
	cache[selector + oldId] = $(selector).html();
	var value = cache[selector + newId];
	$(selector).html(typeof value == "string"
		? value
		: defaultContent);
}

function switchCategory(catId) {
	if (currentCategoryId == catId) return;
	selectOneItem("category", catId+1, currentCategoryId+1);

	listArrayElementsCached("reaction", catId, currentCategoryId, reactions.parsed, function(el, reactId) {
		var reaction = reactions.parsed[reactId];
		if (~catId && reaction.categoryId != catId) return false;
		el.html(reaction.reagents);
		el.attr("onclick", "switchReaction(" + reactId + ")");		
		return true;
	});
	var cl = $(".reaction.selected").attr("class");
	var reactId = -1;
	if (typeof cl == "string") {
		reactId = cl.replace(/[a-z\s]/gi, "");
	}
	//alert(reactId);
	switchReaction(reactId);
	currentCategoryId = catId;
}


function getProductStr(reaction, prodId) {
	var prod = reaction.products[prodId];
	var idx = prod.search(/[a-z0-9]/gi);
	return prod.slice(idx)
}

function switchReaction(reactId) {	
	if (currentReactionId == reactId) return;
	selectOneItem("reaction", reactId, currentReactionId);
	var reactionStr;
	if (~reactId) {
		var reaction = reactions.parsed[reactId];
		reactionStr = reaction.reagents + " -> ";
		listArrayElementsCached("product", reactId, currentReactionId, reaction.products, function(el, prodId) {
			el.html(getProductStr(reaction, prodId));
			el.attr('onclick', 'toggleProduct(' + prodId + ')');			
			return true;
		});
	} else {
		$(".product:visible").remove();
		reactionStr = "";
	}	
	switchContent("#reactionPane", currentReactionId, reactId, reactionStr);
	currentReactionId = reactId;
}

function toggleProduct(prodId) {
	var p = $(".product"+prodId);
	var r_el = $("#reactionPane");
	var r_html = r_el.html();
	var reaction = reactions.parsed[currentReactionId];
	var productStr = getProductStr(reaction, prodId);
	if (p.hasClass("selected")) {
		p.removeClass("selected");		
		r_html = r_html
			.replace(reaction.reagents + " -&gt; ", "##!##")
			.replace(new RegExp("([^\>a-zA-Z0-9]|$)" + productStr + "([^\<a-zA-Z0-9]|$)"), "$1$2")
			.replace(/\s+\+\s+$/, "")
			.replace(/\s+\+\s+\+\s+/, " + ")
			.replace("##!## + ", "##!##")
			.replace("##!##", reaction.reagents + " -&gt; ");
	} else {
		p.addClass("selected");
		if (r_html != (reaction.reagents + " -&gt; ")) r_html += " + ";
		r_html += productStr
	}
	r_el.html(r_html);
}

// Shorthand for $( document ).ready()
$(function() {
	$(".reaction, .product, .category").hide();
	parseReactions();
	listArrayElements("category", categories, function(el, id) {		
		el.html(categories[id]);
		el.click( function() {
			switchCategory(id-1);
		})
		return true;		
	});
});
