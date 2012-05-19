/**
 * @class
 */

util.langbar = 
{
	langs:[],
	sel:null,
	onUpdate:[]
};

(function () {
    "use strict";
 

	/**
	 * @private
	 * @param {String} iso_code ISO code
	 * @returns {boolean}
	 * 
	 */
	util.langbar.hasLanguage = function(iso_code)
	{
		var ret = false
		util.forEach(this.langs, function(lang)
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
			util.forEach(ar, function(lang)
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
				iso_code = String(iso_code).replace(/[-]/, '')
				var strings =  _initLang(util._lang[iso_code])
				util.locale = util._locale[iso_code]
				util.defaultStrings = util._defaultStrings[iso_code]
				for(var i in strings)
				{			
					var o = _s(strings[i].sel) || 'store'
						if(strings[i].html && o != 'store')
							o.setHtml(strings[i].html)
						else if(strings[i].value && o != 'store')
							o.val(strings[i].value)
						else if(strings[i].placeholder && o != 'store')
							o.placeholder(strings[i].placeholder)							
						else if(o == 'store')
							util.storeString(strings[i], iso_code)
				}	
				util.lang = util._lang[iso_code]
				util.selectedLocale = iso_code	
				util.curLang = iso_code
				util.langbar.update()
				util.forEach(this.onUpdate, function(cb)
				{
					cb(iso_code)
				})
				util.userSet.store([{key:'locale', value:iso_code}])				
			}
		}
		catch(err)
		{
			util.debug.log(err)
		}
	}
	
	util.langbar.update = function()
	{
		var o = _s(this.sel)
		if(o)
			o.setHtml('')
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
			_s(sel).setHtml('')
			util.forEach(this.langs, function(lang)
			{
				if(!util.isUndef(util._lang[String(lang.iso_code).replace(/[-]/, '')]))
					if(!String(lang.iso_code).replace(/[-]/, '')
						.match(new RegExp("^" + String(util.curLang).replace(/[-]/, '') + "$")))
					{
						var sep = util.createElement('span')
						sep.addClassName('space')
						sep.addClassName('button')
						var item = util.createElement('a')
						item.addClassName('langLink')
						item.addClassName('button')
						item.setAttribute('href', 
							"javascript:util.follow(" +
							"'javascript:util.langbar.selectLang:" + lang.iso_code + "'," + 
							(util.huds.length ? (util.huds[0].alldata ? util.huds[0].alldata.localecpath : null) : null)  + ")")
						item.setHtml(String(lang.label).toFirstCharUppercase())
						sep.appendChild(item.node)
						_s(sel).appendChild(sep.getNode())
					}
			})
		}
	}
})()