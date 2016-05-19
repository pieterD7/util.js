/**
 * @class util.combobox
 * @description Combobox with callback on keydown
 * @example
		var comb = new util._combobox(
			{},
			function(constraint)
			{
				var drivers = [{name:"Pieter"}, {name:"Fred"}, {name:"Jan"}]
				var fnd = drivers.find(constraint, 'name', 'i')
				return {'json': fnd}
			}, 
			{
				noDataHint: 'Nothing found',//util.lang.error.error_no_addresses_found,
				projection:['name'],
				displayText:['name'],
				maxLength:2,
				itemUrl:"javascript:chooseTrip('%')",
				itemUrlParams:['name']
			},
			'down',
			'combo1	'
		)
		var domEl = comb.display('Type to start search')
		_s('.info').appendChild(domEl)
 */

util.combobox = {
	flags:[],
	options:null,
	cBoxes:[]
};

(function () {
    "use strict";

/**
 * @description Hides dropdown
 */
util.combobox.hide = function()
{
	util.forEach(_sa('.combobox_container ol'), function(box)
	{
		var b = new HTMLElement(box)
		b.style("display:none;")
	})
}

/**
 * @description Set value to combobox as form element
 */
util.combobox.select = function(i, val)
{
	var box = util.combobox.cBoxes[i]
	box.node.value = val
}

util.combobox._init = function()
{
	this.flags = [ 
	  'selectOnClick'
	  ].unum()   
	this.options = new util.struct([util.options], {value:1})		  
}

util._combobox = function(options, jsjQuery, combProj, dropDir, name)
{
	this.id = util.combobox.cBoxes.length
	this.node = null
	this.domEl = util.createElement('div')
	this.options = options
	this.dropdir = null
	this.searchMode = 'AND'
		
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
	this.name = name || ''
	this.options = options
	util.combobox.cBoxes.push(this)
}

util._combobox.prototype.refresh = function(value, list)
{
	var _l = list.parentNode
	_l.removeChild(list)

	this.jsondata = util.toJson(this.dataFunc(value, this.searchMode))
	
	var _list = this._updateList(true)
	if(this.dropDir == 'up')
		_l.insertBefore(_list.getNode(), _l.childNodes[_l.childNodes.length-1])
	else
	{
		_l.appendChild(_list.getNode())	
	}
	_list.style('display:block;position:absolute;margin:0;width:' + 
			(util.getStyle(_l.childNodes[0], 'width').split("px")[0] - 
			2*(util.getStyle(_l.childNodes[0], 'padding').split("px")[0]) -
			2*(util.getStyle(_l.childNodes[0], 'margin').split("px")[0]))+ "px")
}

util._combobox.prototype._createListItemIcon = function(c)
{
	if(this.combProj.itemUrlIconParams && this.combProj.itemUrlIcon)
	{
		var sp = document.createElement('span')
		var url = this.combProj.itemUrlIcon
	
		var item = document.createElement('a')
		item.innerHTML = util.lang.comboBox_iconText

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
util._combobox.prototype._createListItemText = function(c)
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
	if(util.combobox.options.get(util.combobox.flags.slelectOnClick))
		item.setAttribute('href', 'javascript:util.combobox.select('+ this.id + ', "' + 
				this.jsondata.json[c][this.combProj.displayText[0]]  + '")')
	else
		item.setAttribute('href', url)

	return item
}
util._combobox.prototype._updateList = function(b)
{
	var list = util.createElement('ol')
	list.addClassName('combobox_list')
			
	if(	b && this.jsondata.json && this.jsondata.json.length > 0 && 
			util.isObject(this.combProj))
		{
			var max = 1
			if(!util.isUndef(this.combProj['maxLength']))
			{
				max = this.combProj['maxLength']			
			}

			for(var c = 0; c < this.jsondata.json.length && c < max; c++)
			{
				var litem = util.createElement('li')
				var item2 = this._createListItemIcon(c)
				var item = this._createListItemText(c)
				litem.appendChild(item)
				list.setAttribute('style', "display:block;")
				if(item2)
					litem.appendChild(item2)
				list.appendChild(litem)			
			}
		}
		else
		{
			if(b && this.combProj.noDataHint)
			{
				list = util.createElement('ol')
				list.addClassName('combobox_list')
				var li = util.createElement('li')
				list.style("display:block;")
				li.setHtml(this.combProj.noDataHint)
				list.appendChild(li)
			}
		}
	return list
}

util._combobox.prototype.onKeyUpListener = function(inp)
{
	var my = this
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
}

util._combobox.prototype.onSpeechEvent = function(inp, evnt)
{
	var res = ''
	util.forEach(event.results, function(ut)
	{
		res += ut.utterance + ' '
	})
	inp.val(res)
	this.onKeyUpListener(inp)
	inp.val('')
	console.log(res)
}

util._combobox.prototype.display = function(hint)
{
	var my = this
	var combCont = this.domEl
	combCont.setAttribute('class', 'combobox_container')
	
	var inp = util.createElement('input')
	inp.setAttribute('type', 'text')
	inp.setAttribute('autocomplete', 'off')

	if(typeof Modernizr != 'undefined')
	{
		util.isSpeechEnabled = 
			Modernizr.hasEvent('webkitspeechchange', inp.node) || 
			Modernizr.hasEvent('speechchange', inp.node)
	}
		
	if(	this.combProj.speechEnabled && 
		util.isSpeechEnabled)
	{
		inp.setAttribute('x-webkit-speech', '')
		inp.setAttribute('speech', '')
		
		inp.setAttribute('lang', 'en-Hans')
		
		inp.addListener('webkitspeechchange', function(evnt)
		{
			my.searchMode = 'OR'
			my.onSpeechEvent(inp, evnt)
		})			
	}
	
	if(util.isObject(this.parentNode))
	{
		this.node = inp
	}
	else
	{
		this.node = inp.node
	}
	if(this.name)
		inp.setAttribute('name', this.name)
	inp.setAttribute('class', 'combobox_input')
	inp.setAttribute('placeholder', hint)
	
	var list = this._updateList(false)
	
	inp.addListener('keyup', function()
	{
		my.onKeyUpListener(inp)
	})
	inp.addListener('paste', function(o)
	{
		if(util.isObject(this.parentNode))
		{
			var n = this.parentNode.childNodes.length
			my.dropDir == 'up' ? n -= 2 : n -= 1
			var list = this.parentNode.childNodes[n]
			my.refresh(e.clipboardData.getData('text/html'), list)
		}
		else
		{
			var n = inp.node.parentNode.childNodes.length
			my.dropDir == 'up' ? n -= 2 : n -= 1
			var list = inp.node.parentNode.childNodes[n]
			my.refresh(e.clipboardData.getData('text/html'), list)			
		}

	})		
	_s('body').addListener('click', function(e)
	{
		util.combobox.hide()
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
})()
