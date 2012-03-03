/**
 * HUD
 */

util.hud = {
	data:null,
	sitemapSel:null
}

util.hud.getDictItems = function(sel)
{
	_s(sel).setHtml('')
	var ret = new Array()		
	util.ajax({
		url:'data.json', 
		dataType:'json',
		onSuccess: function(data)
		{
			util.hud.data = data.dict
			util.hud.initSitemap(this.sitemapSel)
			
			var comb = new util.combobox(
					util.createElement('div'),
					function(constraint)
					{
						return util.hud.getDictItemsByName(constraint)
					}, 
					{
						noDataHint: util.lang.hud_no_data_hint,
						projection:['menuId', 'name', 'infoUrl'],
						displayText:['name'],
						maxLength:data.showMax,
						itemUrl:"javascript:util.menu.chooose('%', '%')",
						itemUrlParams:['menuId', 'param']
					},
					'down'
				)
				var domEl = comb.display(util.lang.hud_intro)
				_s(sel).appendChild(domEl)
		}
	})
}

util.hud.getDictItemsByName = function(n)
{
	try
	{
		var ret = []
		var names = String(n).split(' ')

		// Hide map if any
		//toggleSitemap(true)

		util.forEach(names, function(name, index)
		{
			if(util.trim(name).isEmpty()) return
			
			var b = util.forEach(util.hud.data, function(en)
			{
				// No synos no match
				if(!en.synos) return
				
				var br = false
				if(!util.isUndef(name))
				{
					if(String(en.name).match(RegExp(String(name).escapeRegExpSpecialChars(), "i")))
					{
						ret.push(en)
						return true
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
								return true
								
							}
						})
					}
				}
				return br
			})
			// Max words in query
			if(index > 8)
				return true			
		})
		ret = ret.unique("name")
		return {json:ret}
	}
	catch(e)
	{
		util.debug.log(e)
	}
}

util.hud.setSitemap = function(sel)
{
	this.sitemapSel = sel
}

util.hud.initSitemap = function()
{
	var s = _s(this.sitemapSel)
	if(s)
	{
		s.setHtml('')
		var _d = util.createElement('div')
		var msg = util.createElement('span')
		msg.setHtml('Toegangsnivo ')
		msg.addClassName("diap")
		msg.addClassName('rightBottom')
		s.appendChild(msg)
		var ul = null, d = null;
	
		util.forEach(util.hud.data, function(en, i)
		{
			if(!en.synos)
				return 
			// rows = 2
			if(i % 2 == 0)
			{
				d = util.createElement('div')
				d.addClassName('sitemapCol')
						
				ul = util.createElement('ul')
			}
			var li = util.createElement('li')
			li.setHtml(en.name)
			ul.appendChild(li)
			d.appendChild(ul)
			_d.appendChild(d)
		})	
		s.appendChild(_d)
	}
}