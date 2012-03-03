/**
 * @class
 * @example
var comb = new util.combobox(
	util.createElement('div'),
	function(constraint)
	{
		return navigator.util.getContactsWithLocation(constraint)
	}, 
	{
		noDataHint: util.lang.error.error_no_addresses_found,
		projection:['name', 'location'],
		display:['name'],
		maxLength:3,
		itemUrl:"javascript:chooseTrip('%', '%')",
		itemUrlParams:['name', 'location']
	},
	'down'
)
var domEl = comb.display(util.lang.combohintlocations)
_s('.info').appendChild(domEl)
 */

util.combobox = function(domEl, jsjQuery, combProj, dropDir)
{
	this.domEl = domEl
	this.dropdir = null
	if(util.isUndef(dropDir))
	{
		this.dropDir = 'up'
	}
	else
	{
		this.dropDir = dropDir	
	}
	if(util.isFunction(jsjQuery))
	{	
		this.dataFunc = jsjQuery
		this.jsondata = util.toJson(jsjQuery());	
	}
	this.combProj = combProj
}

util.combobox.prototype.refresh = function(value, list)
{
	var _l = list.parentNode
	_l.removeChild(list)
	var lastEl = _l.childNodes.lastChild

//	if(!String(value).isEmpty())
		this.jsondata = util.toJson(this.dataFunc(value))
//	else
//		this.jsondata = {}
	
	if(this.dropDir == 'up')
		_l.insertBefore(this._updateList(), _l.childNodes[_l.childNodes.length-1])
	else
		_l.appendChild(this._updateList())		
}

util.combobox.prototype._createListItemIcon = function(c)
{
	if(this.combProj.itemUrlIconParams)
	{
		var sp = document.createElement('span')
		var url = this.combProj.itemUrlIcon
	
		var item = document.createElement('a')
		item.innerHTML = 'Wiki'

		for(var ii = 0; ii < this.combProj.itemUrlIconParams.length; ii++)
		{
			if(!util.isUndef(this.jsondata.json[c][this.combProj.itemUrlIconParams[ii]]))
			{
				url = url.replace(/%/, this.jsondata.json[c][this.combProj.itemUrlIconParams[ii]])
			}
		}
		item.setAttribute('href', url)
		sp.appendChild(item)
		return sp		
	}
}
util.combobox.prototype._createListItemText = function(c)
{
	var item = document.createElement('a')
	for(var i = 0; i < this.combProj.displayText.length; i++)
	{
		if(!util.isUndef(this.jsondata.json[c][this.combProj.displayText[i]]))
		{
			item.innerHTML += this.jsondata.json[c][this.combProj.displayText[i]] + " "
		}
	}
	var url = this.combProj.itemUrl
	for(var ii = 0; ii < this.combProj.itemUrlParams.length; ii++)
	{
		if(!util.isUndef(this.jsondata.json[c][this.combProj.itemUrlParams[ii]]))
		{
			url = url.replace(/%/, this.jsondata.json[c][this.combProj.itemUrlParams[ii]])
		}
	}
	item.setAttribute('href', url)

	return item
}
util.combobox.prototype._updateList = function()
{
	var list = document.createElement('ol')
			
	if(	this.jsondata.json && this.jsondata.json.length > 0 && 
			util.isObject(this.combProj))
		{
			var max = 1
			if(!util.isUndef(this.combProj['maxLength']))
			{
				max = this.combProj['maxLength']			
			}

			for(var c = 0; c < this.jsondata.json.length && c < max; c++)
			{
				var litem = document.createElement('li')
				var item2 = this._createListItemIcon(c)
				var item = this._createListItemText(c)
				litem.appendChild(item)
				if(!util.isUndef(this.jsondata.json[c]['infoUrl']) && item2)
					litem.appendChild(item2)
				list.appendChild(litem)			
			}
		}
		else
		{
			if(	this.combProj.noDataHint)
			{
				list = document.createElement('ol')
				var li = document.createElement('li')
				li.innerHTML = this.combProj.noDataHint
				list.appendChild(li)
			}
		}
	return list
}

util.combobox.prototype.display = function(hint)
{
	var my = this
	var combCont = this.domEl
	combCont.setAttribute('class', 'combobox_container')
	
	var inp = util.createElement('input')
	inp.setAttribute('type', 'text')
	inp.setAttribute('class', 'combobox_input')
	inp.setAttribute('value', hint)
	
	var list = this._updateList()

	inp.addListener('focus', function()
	{
		if(this.value && this.value == hint)
			this.value = ''
		else if(inp.node.value && inp.node.value == hint)
			inp.node.value = ''
	})

	inp.addListener('blur', function()
	{
		if(String(this.value).isEmpty())
			this.value = hint
	})	
	
	inp.addListener('click', function()
	{
	})
	
	inp.addListener('keyup', function()
	{
		if(util.isObject(this.parentNode))
		{
			var n = this.parentNode.childNodes.length
			my.dropDir == 'up' ? n -= 2 : n -= 1
			var list = this.parentNode.childNodes[n]
			my.refresh(this.value, list)
		}
		else
		{
			var n = inp.node.parentNode.childNodes.length
			my.dropDir == 'up' ? n -= 2 : n -= 1
			var list = inp.node.parentNode.childNodes[n]
			my.refresh(inp.node.value, list)			
		}
	})

	if(this.dropDir == 'up')
	{
		combCont.appendChild(list)
		combCont.appendChild(inp.node)
	}
	else
	{
		combCont.appendChild(inp.node)
		combCont.appendChild(list)		
	}
	return combCont
}
