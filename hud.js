/**
 * @class
 * @description hud
 * @example
 {	"cpath":"kWs %",
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
	"showMax":8,
	"dict":[{
		"infoUrl":"documentation\/symbols\/Array.html",
		"name":"Array",
		"synos":["utiljs"],
		"sitemapEntry":true,
		"hudEntry":true,
		"cpath":"Da"},
		{
		"infoUrl":"javascript:app.registeredMenuHandler2",
		"name":"Capitals",
		"synos":[],
		"sitemapEntry":false,
		"hudEntry":false,
		"cpath":"Dc"}]
}
 */

util.hud = {
	data:null,
	sitemapSel:null,
	sitemapColLength:null,
	tabbarSel:null
};

(function () {
    "use strict";

	/**
	 * @description initializes the Hud
	 * @param {string} sel Selector
	 */
	util.hud.getDictionary = function(dictUrl, sel, itemUrl, iconUrl)
	{
		if(sel)
			_s(sel).setHtml('')
		if(!itemUrl)
			return
	
		var ret = new Array()		
		util.ajax({
			url: dictUrl, 
			dataType:'json',
			onSuccess: function(data)
			{
				util.hud.data = data.dict
				util.hud.alldata = data
				util.hud.initSitemap()
				util.hud.initTabBar()
				util.icons.setIcons(data.icons)
				util.icons.display()
				
				var comb = new util.combobox(
					util.createElement('div'),
					function(constraint)
					{
						return util.hud.getDictItemsByName(constraint)
					}, 
					{
						noDataHint: util.lang.hud_no_data_hint,
						projection:['name', 'infoUrl'],
						displayText:['name'],
						maxLength:data.showMax,
						itemUrl:itemUrl,
						itemUrlParams:['infoUrl', 'param'],
						itemUrlIcon: iconUrl,
						itemUrlIconParams: ['infoUrl']
					},
					'down'
				)
				var domEl = comb.display(util.lang.hud_intro)
				if(sel)
					_s(sel).appendChild(domEl)
			}
		})
	}
	
	util.hud.findMatches = function(s, regExp, joinChar)
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
	
	util.hud.getDictItemsByName = function(n)
	{
		try
		{
			var ret = []
			var retreg = []
			var names = String(n).split(' ')
			var data = util.hud.data
	
			// Hide sitemap if any
			util.toggle(util.hud.sitemapSel, false)
			
			// Return empty set when query is empty
			if(util.trim(n).isEmpty()) return {json:null}
			
			// Regular expressions
			util.forEach(util.hud.alldata.regExps, function(regex)
			{
				var fnd = util.hud.findMatches(n, regex.regExp)
				if(fnd)
				{
					var it = util.hud.data.find(regex.matchEntry, "name")
					if(it[0])
					{
						retreg.push(util.extend(it[0],{param:fnd}))
					}
				}
			})
			
			// For each word in query
			util.forEach(names, function(name, index)
			{
				var b = util.forEach(data, function(en)
				{
					if(!en.hudEntry || en.hudEntry === false) return
					
					var br = false
					if(!util.isUndef(name))
					{
						if(String(en.name).match(RegExp(String(name).escapeRegExpSpecialChars(), "i")))
						{
							ret.push(en)
						}
						else 
						{
							br = util.forEach(en.synos, function(syn)
							{
								if(String(syn).match(RegExp(String(name).escapeRegExpSpecialChars(), "i")))
								{									
									var a = {}
									a = util.extend(a, en)
									a = util.extend(a, {name:en.name +  " (" + syn + ")"})
									ret.push(a)								
								}
							})
						}
					}
					return br
				})
				data = ret
				ret = []
				
				// Max words in query
				if(index > 8)
					return true			
			})
			data = data.concat(retreg)
			return {json:data}
		}
		catch(e)
		{
			util.debug.log(e)
		}
	}
	
	util.hud.setTabBar = function(sel)
	{
		util.hud.tabbarSel = sel
	}
	/**
	 * @description (Re)draws tabs and applies css class .activeTab
	 */
	util.hud.initTabBar = function(lastUrl)
	{
		var s = _s(this.tabbarSel)
		if(s)
		{	
			s.setHtml('')
			var tbs_ = util.hud.alldata.tabItems
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
	
				var incontext = util.menu.documentNameIsInContext(it.context) || 
								util.menu.lastUrlIsInContext(it.context)
				var active = util.menu.isActiveLink(url, lastUrl)
				if(util.isUndef(it.context) || incontext)
				{
					var t = util.createElement('span')
					var a = util.createElement('a')
					if(active) t.addClassName("activeTab")
					url = util.hud.makeUrlStr(url, it.cpath)
					a.setAttribute('href', url)
					a.setHtml(String(it.name).toFirstCharUppercase())
					t.appendChild(a)
					_s(util.hud.tabbarSel).appendChild(t)
				}
			})
		}
	}
	
	util.hud.makeUrlStr = function(url, cpath)
	{
		var url = "javascript:util.menu.follow('" + url + "'"
		if(cpath) url += ",'" + cpath + "'"
		url += ")"
		return url
	}
	
	util.hud.setSitemap = function(sel, lengthOfCol)
	{
		var cl = lengthOfCol || 4
		util.hud.sitemapSel = sel
		util.hud.sitemapColLength = cl
	}
	
	util.hud.initSitemap = function()
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
			
			util.forEach(util.hud.data, function(en, i)
			{
				if(!en.sitemapEntry || en.sitemapEntry === false)
					return 
				// rows = this.sitemapColLength
				if(ii++ % util.hud.sitemapColLength == 0)
				{
					d = util.createElement('div')
					d.addClassName('sitemapCol')
							
					ul = util.createElement('ul')
				}
				var li = util.createElement('li')
				var a = util.createElement('a')
				a.setHtml(en.name)
				var url = util.hud.makeUrlStr(en.infoUrl, en.cpath)
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