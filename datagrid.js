/**
 * @description Grid for external data
 */

util.datagrid = {};

(function(){
    "use strict";    

	util._datagrid = function(data, url, type, options)
	{
		this.dataType = type
		this.url = url
		this.data = data
		this.options = options
		this.curPage = 1
		return this;
	}
	
	util.datagrid.XPath = function(data, xpath)
	{
		
	}
	
	util.datagrid.xmlToJson = function(data, options)
	{
		return data
	}
	
	util.datagrid.init = function(url, type, sel, options)
	{	
		var u = util.datagrid.getSUrl(url, options)
		var data = util.ajax(
		{
			url:u,
			dataType:type,
			onSuccess: function(data)
			{
				if(String(type).match(/XML/i))
					data = util.datagrid.xmlToJson(data, options)
				var g = new util._datagrid(data, url, type, options)
				g.display(sel)
			},
			onError: function(){alert('err')}
		})		
	}
	
	/**
	 * @description Get full server url
	 */
	util.datagrid.getSUrl = function(base, options)
	{
		if(util.isString(options.sParamStart))
		{
			var u = base + options.sParamFirstParamDelimiter + 
			options.sParamStart + '=' + ((options.showPage - 1) * options.itemsOnPage) + 
			'&' + options.sParamItems + '=' + options.itemsOnPage + 
			'&' + options.sParamSort + '=' + encodeURIComponent(options.sort)
		}
		return u || base
	}
	
	util._datagrid.prototype.sort = function(data, sort)
	{
		var sortBy = sort || this.options.sort
		if(util.isString(sortBy))
		{
			var sort = util.trim(sortBy.split(",")[0])
			var dir = util.trim(sortBy.split(",")[1])
			var d = data.sort(function(a,b)
			{
				if(String(dir).match(/^ASC$/i))
					return a[sort] > b[sort]
				else
					return b[sort] > a[sort]
			})
			return d
		}
		return data
	}
	
	util._datagrid.prototype.nextPage = function()
	{
		
	}

	util._datagrid.prototype.prevPage = function()
	{
		
	}
	
	util._datagrid.prototype.display = function(sel, start)
	{
		var my = this
		var st = start || ((this.options.showPage - 1) * this.options.itemsOnPage) 
		var out = util.createElement('table')
		var root = this.options.root
		var cols = this.options.colModel
		var d = this.sort(this.data[this.options.root])

		// Col names
		var tr = util.createElement('tr')
		util.forEach(this.options.colNames, function(name)
		{
			var th = util.createElement('th')
			th.setHtml(name)
			tr.appendChild(th)
		})
		out.appendChild(tr)
		util.forEach(d, function(i, ii)
		{
			// Start?
			if(ii < st)
				return
				
			// Rows?
 			if(ii == st + my.options.itemsOnPage)
				return true
			
			var tr = util.createElement('tr')	
				
			// Cols
			util.forEach(cols, function(c)
			{
				var col = util.createElement('td')
				col.setHtml(i[c.id])
				tr.appendChild(col)
			})
			out.appendChild(tr)
		})
		_s(sel).appendChild(out)
	}
})()

util.ready(function()
{
	util.datagrid.init('data.xml', 'xml', '#grid', {
		'itemsOnPage':2, 
		'showPage':1,
		'rootXPath': 'icons', 
		'colNames':['naam', 'afbeelding'],
		'colXPaths':['name', 'img'],
		'sort':'name, ASC'
//		'sParamStart': 'start',
//		'sParamItems': 'n',
//		'sParamFirstParamDelimiter': '?',
//		'sParamSort': 'sort'
	})
})