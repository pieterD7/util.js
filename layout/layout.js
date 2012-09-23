/**
 * @description Base class for layouts
 * @example
 * util.columnlayout._init = function()
 * {
 * util.extend(this, util.layout)
 * this.toString = function(){return "[util.columnlayout]"}
 * }
 */

util.layout = {
	toString : function()
	{
		return "["+(this.sel + ' w/ ' || '')+(this.items? this.items.length : '')+" items]"
	},
	setSel : function(sel)
	{
		this.sel = sel
	},
	initFromHtml : function(sel)
	{
		this.sel = sel
		this.items = this.items.concat(util.contentfromhtml(sel))		
	},	
	cb:[],
	onDisplayItem : function(cb)
	{
		if(util.isFunction(cb))
			this.cb.push(cb)
	},
	getItem : function(id)
	{
		var i = null;
		if(id)
			i = this.items.find(id, 'name')
		if(i && i[0])
		{
			i = i[0]
		}
		else if(this.currentItem)
		{
			i = this.items.find(util.layo.currentItem, "name")[0]
		}
		else
		{
			i = this.items[0]
		}
		this.currentItem = i.name;
		return i
	},
	setContentItems : function(ar)
	{
		var my = this
		util.forEach(ar, function(item)
		{
			if(item instanceof util.content.ContentItem)
				my.items.push(item)			
		})
	},
	replaceItem : function(n, item)
	{
		var i = util.layo.items.indexOf(n, "name");
		util.layo.items[i]  = item;
		var ii = {"id":n, "content":item}
		this.dirtyBlocks.push(ii)
	}
};
