/**
 * @class
 */

util.langbar = 
{
	langs:[],
	sel:null,
	onUpdate:[]
}

/**
 * @private
 * @param {String} iso_code ISO code
 * @returns {boolean}
 * 
 */
util.langbar.hasLanguage = function(iso_code)
{
	var ret = false
	this.langs.forEach(function(lang)
	{
		if(lang.iso_code == iso_code)
			ret = true;
	})
	return ret
}
/**
 * @description Sets function to be called when user selects language
 * @param {function} cb Callback
 */
util.langbar.setOnUpdate = function(cb)
{
	if(util.isFunction(cb))
	{
		this.onUpdate.push(cb)
	}
}

util.langbar.setLanguages = function(ar)
{
	if(util.isObject(ar))
	{
		ar.forEach(function(lang)
		{
			util.langbar.langs.push({iso_code:lang.iso_code, label:lang.label})
		})
	}
}

util.langbar.selectLang = function(iso_code)
{
	try{
		if( util.isString(iso_code) && 
			util.langbar.hasLanguage(iso_code))
		{
			strings =  _initLang(util._lang[iso_code])
			util.locale = util._locale[iso_code]
			util.defaultStrings = util._defaultStrings[iso_code]
			for(var i in strings)
			{			
				var o = _s(strings[i].sel) || 'store'
					if(strings[i].html && o != 'store')
						o.setHtml(strings[i].html)
					else if(strings[i].value)
						o.val(strings[i].value)
					else if(o == 'store')
						util.storeString(strings[i], iso_code)
			}	
			util.lang = util._lang[iso_code]
			util.curLang = iso_code
			util.langbar.update()
			this.onUpdate.forEach(function(cb)
			{
				cb()
			})
		}
	}
	catch(err)
	{
		util.debug.log(err)
	}
}

util.langbar.update = function()
{
	_s(this.sel).setHtml('')
	util.langbar.display(this.sel)
}

/**
 * @example
 * 	var langs = [{iso_code:'en', label:'english'},
	             {iso_code:'nl', label:'nederlands'},
	             {iso_code:'it', label:'italiano'}]
	util.langbar.setLanguages(langs)
	
	// Assign selector
	util.langbar.display('#langSelector')

 * 
 */
util.langbar.display = function(sel)
{
	if(util.isString(sel) && _s(sel))
	{
		this.sel = sel
		this.langs.forEach(function(lang)
		{
			if(!String(lang.iso_code)
				.match(new RegExp("^" + util.curLang + "$")))
			{
				var sep = document.createElement('span')
				sep.setAttribute('class', 'space')
				var item = util.createElement('a')
				item.setAttribute('class', 'langLink')
				item.setAttribute('href', "javascript:util.langbar.selectLang('" + lang.iso_code + "')")
				item.setHtml(String(lang.label).toFirstCharUppercase())
				sep.appendChild(item.node)
				_s(sel).appendChild(sep)
			}
		})
	}
}