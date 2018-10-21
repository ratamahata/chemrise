var currentCategoryId, currentReactionId;
var previousCategoryId;
var newCatId;
var cache = {};

function parseReactions() {
	var productRegex = /[\+\-]\s*[^\s\+\-]+/gi;
	var digitRegex = /([a-z])(\d+)/gi;	
	for (var key in reactions) {
	    var reactionsInCat = reactions[key].raw;
	    var arr = reactions[key].parsed = [];
	    for (var r in reactionsInCat) {
	        var obj = new Reaction(reactionsInCat[r]);
	        arr.push(obj);
	    }
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

function getReactions(catId) {
    var list = reactions["cat" + catId];
    return list == null ? null : list.parsed;
}

function setReactions(catId, rawStr) {
    var list = reactions["cat" + catId] = {};
    list.parsed = [];
    var arr = rawStr.split(',');
    for (k in arr) {
        list.parsed.push(new Reaction(arr[k]));
    }
}

function getCurrentReaction() {    
    return getReactions(currentCategoryId)[currentReactionId];
}

function getReaction(catId, reactId) {
    var list = getReactions(catId);
    return list && ~reactId ? list[reactId] : null;
}

function switchNewCategory(rlist) {
    setReactions(newCatId, rlist);
    switchCategory(newCatId)
}

function switchCategory(catId) {
    if (currentCategoryId == catId) return;
    if (!getReactions(catId)) {
        newCatId = catId;
        PageMethods.getAllReactionsStr(1, catId, switchNewCategory)
        return;
    }
	selectOneItem("category", catId, currentCategoryId);
	listArrayElementsCached("reaction", catId, currentCategoryId, getReactions(catId), function (el, reactId) {	    
	    var reaction = getReaction(catId, reactId);		
		el.html(reaction.reagents);
		el.attr("onclick", "switchReaction(" + reactId + ")");		
		return true;
	});
	var cl = $(".reaction.selected").attr("class");
	var reactId = -1;
	if (typeof cl != "string") {
		cl = $(".reaction:visible").attr("class");
	}
	if (typeof cl == "string") {
		reactId = cl.replace(/[a-z\s]/gi, "");
	}
	previousCategoryId = (typeof currentCategoryId == "undefined" ? catId : currentCategoryId);
	currentCategoryId = catId;
	switchReaction(reactId);	
}

function switchReaction(reactId) {	
    if (currentReactionId == reactId && previousCategoryId == currentCategoryId) return;
	selectOneItem("reaction", reactId, currentReactionId);
	var reactionStr;
	if (~reactId) {
	    var reaction = getReaction(currentCategoryId, reactId);
	    reactionStr = reaction.reagents + " -> ";
	    listArrayElementsCached("product", currentCategoryId + "_" + reactId, previousCategoryId + "_" + currentReactionId, reaction.products, function (el, prodId) {
			el.html(reaction.getProductStr(prodId));
			el.attr('onclick', 'toggleProduct(' + prodId + ')');			
			return true;
		});
		if (reaction.isSomeProductSelected()) {
			$(".checkButton").show();
		} else {
			$(".checkButton").hide();
		}
	} else {
		$(".product:visible").remove();
		reactionStr = "";
		$(".checkButton").hide();
	}	
	switchContent("#reactionPane", currentReactionId, reactId, reactionStr);
	switchContent("#descriptionPane", currentReactionId, reactId, "");
	currentReactionId = reactId;
}

function toggleProduct(prodId) {
    var reaction = getCurrentReaction();
	if (reaction.solved) return;
	var p = $(".product"+prodId);
	var r_el = $("#reactionPane");
	if (p.hasClass("selected")) {
		p.removeClass("selected");
		reaction.removeProduct(prodId);
	} else {
		$(".checkButton").show();
		p.addClass("selected");
		reaction.addProduct(prodId);
	}
	r_el.html(reaction.getText());
}

function checkProducts() {
    var reaction = getCurrentReaction();
	var passed = false;
	$("#descriptionPane").html(currentReactionId < 0
		? ""
		: (passed = (reaction.getValidationErrors().length == 0))
			? "Верно!"
			: "Неверно! <button onclick='showHint()'>Показать подсказку</button>");

	if (passed) {
		$(".reaction" + currentReactionId).addClass("solved");
		reaction.solved = true;
	}	
}

function showHint() {
    var reaction = getCurrentReaction();
	$("#descriptionPane").html(currentReactionId < 0
		? ""
		: reaction.getValidationErrors().join("<br/>\n"));
}

