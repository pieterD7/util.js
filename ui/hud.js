/**
 * @class 
 * @description Keyword search
 * @example
 {	"cpath":"kWs %s",
	"showMax":8,
 	"icons":[{
  		"name":"Cardgame", 
  		"img":"medium/cardgame.png", 
  		"url":"cardgame.html", 
  		"cpath":"c",
  		"ord":"2", 
  		"context":"index.html"}],
	"tabItems":[{
		"name":"Tab1",
		"url":"javascript:app.registeredMenuHandler1:param1",
		"cpath":"t",
		"ord":"2", 
  		"context":"index.html|javascript:util.menu.drawMarkerOnMap"}],
	"regExps":[{
		"regExp":"(\\d{2}\\.\\d{2})",
		"matchEntry":"References"},
		{"regExp":"([A-Z]\\w*)",
		"matchEntry":"Capitals"}],
	"dict":[{
		"infoUrl":"documentation\/symbols\/Array.html",
		"name":"Array",
		"synos":["utiljs"],
		"sitemapEntry":true,
		"hudEntry":true,
		"cpath":"Da"
		},
		{
		"infoUrl":"javascript:app.registeredMenuHandler2",
		"name":"Capitals",
		"synos":[],
		"sitemapEntry":false,
		"hudEntry":false,
		"cpath":"Dc"}]
}
 */

(function () {
    "use strict";

    util.hud = function(menu, icons){
    	this.comb = null
		this.data = null
		this.sitemapSel = null
		this.sitemapColLength = null,
		this.tabbarSel = null,
		this.onGetDictionary = []
		this.icons = icons;
		this.menu = menu
		this.node = null
		this.searchMode = 'AND'
	};   
    
    util.hud.prototype.setOnGetDictionary = function(cb)
    {
    	if(util.isFunction(cb))
    	{
    		this.onGetDictionary.push(cb)
    	}
    }
    
	/**
	 * @description initializes the Hud
	 * @param {String} dictUrl URL to dictionary
	 * @param {String} sel Selector
	 * @param {String} itemUrl URL to apply to item click
	 * @param {String} iconUrl URL to apply to icon click
	 */
	util.hud.prototype.getDictionary = function(dictUrl, sel, itemUrl, iconUrl)
	{
		if(sel)
			_s(sel).setHtml('')
		if(!itemUrl)
			return
	
		var ret = new Array()
		var my = this
		util.ajax({
			url: dictUrl, 
			dataType:'json',
			onSuccess: function(data)
			{
				my.data = data.dict
				my.alldata = data
				my.initSitemap()
				my.initTabBar()
				my.icons.setIcons(data.icons)
				my.icons.display()
				util.forEach(my.onGetDictionary, function(cb)
				{
					if(util.isFunction(cb))
						cb()
				})
				
				var opts = util.struct([util.options], {value:0})	
				var comb = new util._combobox(
					opts,
					function(constraint, mode)
					{
						return my.getDictItemsByName(constraint, mode)
					}, 
					{
						speechEnabled:true,
						noDataHint: util.lang.hud_no_data_hint,
						projection:['name', 'infoUrl'],
						displayText:['name'],
						maxLength:data.showMax,
						itemUrl:itemUrl,
						itemUrlParams:['infoUrl', 'param'],
						itemUrlIcon: iconUrl,
						itemUrlIconParams: ['infoUrl']
					},
					'down',
					'txt1'
				)
				my.comb = comb				
				util.huds.push(this)
				var domEl = comb.display(util.lang.hud_intro)
				my.node = domEl
				if(sel)
					_s(sel).appendChild(domEl)
			}
		})
	}
	
	util.hud.prototype.findMatches = function(s, regExp, joinChar)
	{
		var c = ','
		if(util.isString(joinChar))
			c = joinChar
		if(String(s).match(RegExp(regExp)))
		{
			var ss = s.match(RegExp(regExp, "g"))	
			return ss.join(c)
		}
		return false	
	}
	
	util.hud.prototype.getDictItemsByName = function(n, mode)
	{
		try
		{
			
			console.log(" MODE", mode)
			var my = this
			var ret = []
			var ret2 = []
			var retreg = []
			var names = String(n).split(' ')
			var data = this.data

			// Store cpath if any
			var cpath = this.alldata.cpath;
			if(	!util.trim(cpath).isEmpty() &&
				!util.isUndef(n))
			{
				util.cpath.pushCPath(sprintf(cpath, [n]))
			}	
			// Hide sitemap if any
			util.toggle(this.sitemapSel, false)
			
			// Return empty set when query is empty
			if(util.trim(n).isEmpty()) return {json:null}
			
			// Regular expressions
			util.forEach(this.alldata.regExps, function(regex)
			{
				var fnd = my.findMatches(n, regex.regExp)
				if(fnd)
				{
					var it = my.data.find(regex.matchEntry, "name")
					if(it[0])
					{
						retreg.push(util.extend(it[0],{param:fnd}))
					}
				}
			})
			
			// For each word in query
			util.forEach(names, function(name, index)
			{
				if(!util.trim(name).isEmpty())
				{
					var b = util.forEach(data, function(en)
					{
						if(!en.hudEntry || en.hudEntry === false) return
						
						var br = false
						if(!util.isUndef(name))
						{
							if(String(en.name).match(RegExp(String(name).escapeRegExpSpecialChars(), "i")))
							{
								var a = util.extend(en, {param:en.name})
								ret.push(a)
							}
							else 
							{
								br = util.forEach(en.synos, function(syn)
								{
									if(String(syn).match(RegExp(String(name).escapeRegExpSpecialChars(), "i")))
									{									
										var a = util.extend(en, {param:en.name})
										a = util.extend(a, {name:en.name +  " (" + syn + ")"})
										ret.push(a)								
									}
								})
							}
						}
						return br
					})
					if(mode.equals('AND', 'i'))
					{
						data = ret
						ret2 = ret
					}
					else
						ret2 = ret2.concat(ret)					
				}

				// Max words in query
				if(index > 8)
					return true			
			})
			return {json:retreg.concat(ret2).unique('name')}
		}
		catch(e)
		{
			util.debug.log(e)
		}
	}
	
	util.hud.prototype.setTabBar = function(sel)
	{
		this.tabbarSel = sel
	}
	/**
	 * @description (Re)draws tabs and applies css class .activeTab
	 */
	util.hud.prototype.initTabBar = function()
	{
		var my = this
		var s = _s(this.tabbarSel)
		if(s)
		{	
			s.setHtml('')
			var tbs_ = this.alldata.tabItems
			var tbs = tbs_.sort(function(a, b){return a.ord -  b.ord})
				
			util.forEach(tbs, function(it, i)
			{			
				var url = ''
				var urlar = it.url.split(':')
	
				if (String(urlar[0]).match(/javascript/i))
				{
					url = urlar.join(':')
				}
				else
					url = urlar[0]
	
				var incontext = util.documentNameIsInContext(it.context) || 
								util.lastUrlIsInContext(it.context)
				var active = util.isActiveLink(url, util.lastUrl)
				if(util.isUndef(it.context) || incontext)
				{
					var t = util.createElement('span')
					var a = util.createElement('a')
					if(active) t.addClassName("activeTab")
					url = util.makeUrlStr(url, it.cpath)
					a.setAttribute('href', url)
					a.setHtml(String(it.name).toFirstCharUppercase())
					t.appendChild(a)
					_s(my.tabbarSel).appendChild(t)
				}
			})
		}
	}
	
	util.makeUrlStr = function(url, cpath)
	{
		var url = "javascript:util.follow('" + url + "'"
		if(cpath) url += ",'" + cpath + "'"
		url += ")"
		return url
	}
	
	util.hud.prototype.setSitemap = function(sel, lengthOfCol)
	{
		var cl = lengthOfCol || 4
		this.sitemapSel = sel
		this.sitemapColLength = cl
	}
	
	util.hud.prototype.initSitemap = function()
	{
		var s = _s(this.sitemapSel)
		if(s)
		{
			s.setHtml('')
			var _d = util.createElement('div')
	//		var msg = util.createElement('span')
	//		msg.setHtml('Toegangsnivo ')
	//		msg.addClassName("diap")
	//		msg.addClassName('rightBottom')
	//		s.appendChild(msg)
			var ul = null, d = null;
			var ii = 0;
			var my = this
			util.forEach(this.data, function(en, i)
			{
				if(!en.sitemapEntry || en.sitemapEntry === false)
					return 
				// rows = this.sitemapColLength
				if(ii++ % my.sitemapColLength == 0)
				{
					d = util.createElement('div')
					d.addClassName('sitemapCol')
							
					ul = util.createElement('ul')
				}
				var li = util.createElement('li')
				var a = util.createElement('a')
				a.setHtml(en.name)
				var url = util.makeUrlStr(en.infoUrl, en.cpath)
				a.setAttribute('href', url)
				li.appendChild(a)
				ul.appendChild(li)
				d.appendChild(ul)
				_d.appendChild(d)
			})	
			s.appendChild(_d)
		}
	}
})();