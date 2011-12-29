/**
 * 
 */

util.langbar = 
{
	langs:[],
	sel:null,
	onUpdate:[]
}

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
		if(util.isString(iso_code))
		{
			strings =  _initLang(util._lang[iso_code])
			util.locale = util._locale[iso_code]
			util.defaultStrings = util._defaultStrings[iso_code]
			for(var i in strings)
			{					
				var o = _s(strings[i].sel) || 'store'
				if(util.isUndef(strings[i].value) && o != 'store')
					if(typeof o.setHtml === 'function')
						o.setHtml(strings[i].html)
					else if(o != 'store')
						if(typeof o.val === 'function')
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