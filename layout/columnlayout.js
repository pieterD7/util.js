/**
 * @class util.columnlayout
 * @description Layout displaying one of one or more columns w/ swipe 
 * to next/prev column
 */
util.columnlayout = {
	items:[],
	sel:null,
	o:null,
	cb:[],
	currentItem:null
};

(function(){
	"use strict"

	util.columnlayout._init = function()
	{
		util.extend(this, util.layout)
		this.toString = function(){return "[util.columnlayout] items=" + this.items.length}
	}

	/**
	 * @description Inits html
	 * @param {String} sel Selector
	 */
	util.columnlayout.initDisplay = function(sel)
	{
		var o = _s(sel || util.columnlayout.sel)
		if(o)
		{
			util.columnlayout.sel = sel || util.columnlayout.sel
			o.setHtml('')

			var i = util.columnlayout.getItem()
			
			util.forEach(this.items, function(item)
			{
				var n = util.columnlayout.items.indexOf(item.name, 'name')
				var total = util.columnlayout.items.length, left = n, right = total - n	 - 1	
				
				var div = util.createElement('div')
				var head = util.createElement('div')
				head.setHtml(item.name)
				head.addClassName('itemHeader')
				
				div = util.columnlayout.initCol(div)
					
				div.addClassName('itemBody')
				div.setAttribute('id', item.name)
				div.setHtml(item.body)
				div.appendChild(util.columnlayout.initHint(left,right,total))
				div.style('display:none;')
				div.node.insertBefore(head.node, div.node.firstChild)
				_s(util.columnlayout.sel).appendChild(div)
			})
			_s(util.columnlayout.sel).replaceStyle('display:block;')
		}
	}	
	
	util.columnlayout.initCol = function(div)
	{		
		div.addListener("dragstart", function(e)
		{
			var pos = util.eventObjectToPos(e)
			util.dnd.posx = pos.x
			util.dnd.posy = pos.y
		})		
		div.addListener("dragend", function(e)
		{					
			util.dnd.isDrag(e, function(dir)
			{
				var n = util.columnlayout.nextItem(dir)
				if(n != false)
					util.columnlayout.display(util.columnlayout.items[n].name)
			})
		})
		return div
	}
	
	/**
	 * @description Displays next item
	 * @param {String} dir 'left' or 'right' 
	 */
	util.columnlayout.nextItem = function(dir)
	{
		var n = false
		var i = util.columnlayout.items.indexOf(util.columnlayout.currentItem, 'name')
		switch(dir)
		{
			case 'right':
				if(i > 0)
				{
					n = i - 1
				}
				break;
			case 'left':
				if(i+1 < util.columnlayout.items.length)
				{
					n = i + 1
				}
		}
		return n
	}

	util.columnlayout.initHint = function(left,right,total)
	{
		var div = util.createElement('div')
		div.setHtml(sprintf(
					'<br/> <a href="%s">(%s)</a> Swipe om te bladeren (<a href="">Ik snap het.</a>) <a href="%s">(%s)</a><br/>' +
					'<div class="diap" style="width:100%;text-align:center;"><b>%s/%s</b></div>',
				"javascript:util.columnlayout.display(util.columnlayout.items[util.columnlayout.nextItem('right')].name)",
				(left >0?left:'-'),
				"javascript:util.columnlayout.display(util.columnlayout.items[util.columnlayout.nextItem('left')].name)",
				(right >0?right:'-'),
				left+1,
				total))
		return div
	}
	
	util.columnlayout.initColumns = function(sel, n)
	{
		var cs = document.querySelectorAll(sel + ' div')
		for(var c = 0; c < cs.length; c++)
		{
			var o = util.columnlayout.initCol(new HTMLElement(cs[c]))
			_s(sel).appendChild(o)
		}
	}
	
	/**
	 * @description Displays a column
	 * @param {String} id Name of util.content.ContentItem. Can be omitted.
	 */
	util.columnlayout.display = function(id)
	{
		var i = util.columnlayout.getItem(id)
		var ar = _sa(util.columnlayout.sel + ' .itemBody')
		util.forEach(ar, function(d)
		{
			var dd = new HTMLElement(d)
			dd.replaceStyle('display:none;')
		})

		var c = _s(util.columnlayout.sel + ' div#' + i.name)
		c.replaceStyle('display:block;')
		util.forEach(util.columnlayout.cb, function(cb)
		{
			cb(i.name)
		})
		util.columnlayout.currentItem = i.name
	}
})()