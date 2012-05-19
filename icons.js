/**
 * 
 */

(function () {
    "use strict";

    util.icons = function(sel){
    		this.sel = sel
    		this.data = null
    	};
    
	util.icons.prototype.setIcons = function(ar)
	{
		this.data = ar
	}
	
	util.icons.prototype.setSel = function(sel)
	{
		this.sel = sel
	}
	
	/**
	 * @description Displays icons and applies css class .activeicon
	 */
	util.icons.prototype.display = function()
	{
		var my = this

		_s(this.sel).setHtml('')
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
			
			if(util.isActiveLink(i.url))
				d.addClassName('activeicon')
		
			var url = util.makeUrlStr(i.url, i.cpath)
	
			a.setAttribute('href', url)
	
			img.setAttribute('src', util.iconDir + i.img)
			img.style('border:none;')
	
			var incontext = util.documentNameIsInContext(i.context) || util.lastUrlIsInContext(i.context)
			if(util.isUndef(i.context) || incontext)
			{
				a.appendChild(img)
				d.appendChild(a)
				d.appendChild(dd)
			}
			
			_s(my.sel).appendChild(d)
		})
	}
})()