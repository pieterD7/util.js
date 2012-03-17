/**
 * 
 */

util.icons = {
	sel:null,
	data:null
};

(function () {
    "use strict";
 
	util.icons.setIcons = function(ar)
	{
		this.data = ar
	}
	
	util.icons.setSel = function(sel)
	{
		this.sel = sel
	}
	
	/**
	 * @description Displays icons and applies css class .activeicon
	 */
	util.icons.display = function(lastUrl)
	{
		var _lastUrl = lastUrl || util.menu.lastUrl
		_s(util.icons.sel).setHtml('')
		var icns = this.data
		if(icns)
			icns = icns.sort(function(a, b){ return a.ord - b.ord})
		
		util.forEach(icns, function(i)
		{	
			var d = util.createElement('div')
			var dd = util.createElement('div')
			var a = util.createElement('a')
			var img = util.createElement('img')
	
			dd.setHtml(i.name)
			
			if(util.menu.isActiveLink(i.url, _lastUrl))
				d.addClassName('activeicon')
		
			var url = util.hud.makeUrlStr(i.url, i.cpath)
	
			a.setAttribute('href', url)
	
			img.setAttribute('src', 'icons/' + i.img)
			img.style('border:none;')
	
			var incontext = util.menu.documentNameIsInContext(i.context) || util.menu.lastUrlIsInContext(i.context)
			if(util.isUndef(i.context) || incontext)
			{
				a.appendChild(img)
				d.appendChild(a)
				d.appendChild(dd)
			}
			
			_s(util.icons.sel).appendChild(d)
		})
	}
})()