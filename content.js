/**
 * @class util.content
 */

util.content = {
		
};

util.contentfromhtml = {
	
};

(function(){
	"use strict"
	
	/**
	 * @description Content item used by layout 
	 * @param {String} name Name Must be unique within set and starts with alpha-character
	 * @param {String} header Item header
	 * @param {String} body Item body
	 * @param {Boolean} hidden Hidden tab?
	 * @param {String} icon Icon filename
	 */
	util.content.ContentItem = function(name, header, body, hidden, icon)
	{
		// Must be unique within set and starting with alpha-character
		this.name = name
		
		// Hidden tab?
		this.hidden = hidden || false
		
		// Item header
		this.header = header || ''
		
		this.isFromHtml = false
		
		// CSS item header
		this.cssItemHeader = 'contentHeaderItem'
			
		// CSS item body
		this.cssItemBody = 'contentItem'
			
		// Item body
		this.body = body || ''
		
		// Icon
		this.icon = icon || ''
	}
	
	/**
	 * @description Initialize array of util.content.ContentItems from markup
	 * @returns {Array} Content items
	 */
	util.contentfromhtml = function(sel)
	{
		var items = []
		var c = 0
		var n = _s(sel).getNode().childNodes.length
		util.forEach(_s(sel).getNode().childNodes, function(el, i)
		{
			var item = new util.content.ContentItem()
			item.isFromHtml = true
			if(	el.nodeName == '#text' ||
				el.nodeName == '#comment')
			{
				return
			}			
			if(i <= n / 2)
			{
				if(el.style.display == 'none')
					item.hidden = true
				var ic = el.getAttribute('icon')
				if(!util.trim(ic).isEmpty())
				{
					item.icon = ic
				}
				item.header = el.innerHTML
				items.push(item)
			}
			else if(items[c])
			{
				if(! items.find(items[c].header, 'name'))
				{
					items[c].name = items[c].header
					items[c++].body = el.innerHTML					
				}
				else
				{
					throw new util.error("contentFromHtml : ContentID already in use")
				}
			}
		})
		if(util.isDebug)
			console.log("itemsFromHtml", items)
		return items	
	}	
	
})()