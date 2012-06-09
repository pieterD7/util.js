/**
 * @memberOf util
 * @description Pointer to current layout
 */
util.layo = null	


/**
 * @class util.layout
 * @description Base class for layouts
 * @example
 * util.columnlayout._init = function()
 * {
 * util.extend(this, util.layout)
 * this.toString = function(){return "[util.columnlayout]"}
 * }
 */
util.layout = {
		
	/**
	 * @description Default toString()
	 */
	toString : function()
	{
		return "["+(this.sel + ' w/ ' || '')+(this.items? this.items.length : '')+" items]"
	},
	setSel : function(sel)
	{
		this.sel = sel
	},

	/**
	 * @description Init or append items from markup
	 * @param {String} sel Selector to source markup
	 */
	initFromHtml : function(sel)
	{
		this.sel = sel
		this.items = this.items.concat(util.contentfromhtml(sel))		
	},

	/**
	 * @description Array of callbacks to be called after displaying the item
	 */
	cb:[],
	
	/**
	 * @description Set callback on display item
	 * @param cb
	 */
	onDisplayItem : function(cb)
	{
		if(util.isFunction(cb))
			this.cb.push(cb)
	},
	
	/**
	 * @description Get appropriate item
	 * @param {String} id Name of the util.content.ContentItem instance
	 * @returns {util.content.ContentItem}
	 */
	getItem : function(id)
	{
		var i = this.items.find(id, 'name')
		if(i && i[0])
		{
			i = i[0]
		}
		else
		{
			i = this.items[0]
		}
		return i
	},
	
	/**
	 * @description Init or append items to be available
	 * @param {Array} ar Array of util.content.ContentItem instances
	 */
	setContentItems : function(ar)
	{
		var my = this
		util.forEach(ar, function(item)
		{
			if(item instanceof util.content.ContentItem)
				my.items.push(item)			
		})
	}
};
