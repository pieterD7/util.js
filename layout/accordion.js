/**
 * @description 
 */

util.accordion = {
	items:[],
	sel:null,
	currentItem:false,
	dirtyBlocks:[],
	cb:[]
};

(function () {
    "use strict";

	util.accordion._init = function()
	{
		util.extend(this, util.layout)
		this.toString = function(){return "[util.accordion] items=" + this.items.length}
	}
    
	util.accordion.initDisplay = function()
	{	
		var sel = util.accordion.sel;
		util.forEach(util.accordion.items, function(item)
		{
			var el = util.createElement("div");
			el.node.setAttribute("class", "accordion-title");
			el.removeClassName("accordion-title-active");

			if(item.name == util.accordion.currentItem) el.addClassName("accordion-title-active") 
			el.addListener("click", function(e)
			{
				util.accordion.handleItemclick(e)
			})
			
			var elInner = util.createElement("div")
			elInner.setAttribute("class", "accordion-content")
			if(item.name == util.accordion.currentItem) 
			{
				elInner.addClassName("accordion-body-active");
				elInner.style("display:block");
			}
			else elInner.style("display:none")
			elInner.setHtml(item.body);
			elInner.setAttribute("id", item.name)
			el.setHtml(item.name);
			el.setAttribute("id", "click_" + item.name);
			_s(util.accordion.sel).appendChild(el)
			_s(util.accordion.sel).appendChild(elInner);
		})
	}

	util.accordion.handleItemclick = function(e)
	{
		util.forEach(e.srcElement.attributes, function(attr)
		{
			var targ;
			if (!e) var e = window.event;
			if (e.target) targ = e.target;
			else if (e.srcElement) targ = e.srcElement;
			if (targ.nodeType == 3) // defeat Safari bug
				targ = targ.parentNode;
			var nn = targ.getAttribute("id")

			if(nn)
			{
				nn = String(nn).replace(/^click_/, "");
				var s = _s(util.accordion.sel + " #" + util.accordion.currentItem)
				if(s) 
				{
					s.removeClassName("accordion-body-active")
					s.style("display:none")
				}
				util.accordion.display(nn);						
			}
		})
	}

	util.accordion.display = function(id)
	{
		if(!util.accordion.currentItem)
			util.accordion.initDisplay()
		util.forEach(util.accordion.items, function(item)
		{
			_s("#" + item.name).style("display:none")
		})
		var i = util.accordion.getItem(id)
		if(util.accordion.dirtyBlocks.find(i.name, "id"))
		{
			var block = util.accordion.dirtyBlocks.find(i.name, "id")
			_s("#" + i.name).setHtml(block[0].content.body)
			util.accordion.dirtyBlocks.splice(util.accordion.dirtyBlocks.indexOf(i.name, "id"),1)
		}
		_s("#" + i.name).style("display:block")

		//_s(util.accordion.sel).setHtml('');
		util.forEach(util.accordion.cb, function(cb){cb(i)})
	}

	util.accordion.setItem = function(o)
	{
		util.accordion.items.push(o)
	}

})()
