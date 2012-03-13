/**
 * @class
 * 
 */

util.crumb = function(langId, cb){
	this.langId = langId
	this.call = cb
	this.n = null
	/**
	 * @private
	 */
	this.display = function()
	{
		return "<a 	class='crumb' " +
				"	href='javascript:util.crumbs.follow(" + this.n + ")'>" + 
				util.lang[this.langId] + "</a>"		
	}
}

/**
 * @class
 */
util.crumbs = {
	crumbSeparator: " - ",
	_crumbs: [],
	_sel: null	
}

util.crumbs.setSel = function(sel)
{
	this._sel = sel
}

util.crumbs.setCrumbSeparator = function(sep)
{
	this.crumbSeparator = sep
}

util.crumbs.push = function(crumb)
{
	if(crumb instanceof util.crumb)
	{
		crumb.n = this._crumbs.length
		this._crumbs.push(crumb)
	}
}

util.crumbs.pop = function(crumb)
{
	return this._crumbs.pop()
}

util.crumbs.reset = function()
{
	for(var c = 0; c < util.crumbs._crumbs.length - 1; c++)
	{
		util.crumbs.pop()
	}
	util.crumbs.display()
}

util.crumbs.follow = function(n)
{
	util.crumbs._crumbs.forEach(function(crumb, i)
	{
		if(i == n && util.isFunction(crumb.call))
			crumb.call()
	})
	for(var c = 1; c < util.crumbs._crumbs.length - n; c++)
	{
		util.crumbs.pop()
	}
	util.crumbs.display(util.crumbs._sel)	
}

util.crumbs.display = function(sel)
{
	var ret = ''
	this._crumbs.forEach(function(crumb, i)
	{
		ret += crumb.display()
		if(i < util.crumbs._crumbs.length - 1)
		{
			ret += util.crumbs.crumbSeparator
		}
	})
	_s(util.crumbs._sel).setHtml(ret)
}
