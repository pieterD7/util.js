/**
 * @class
 * cpath
 * @descripton Module to store clickpaths locally and retrieve 
 * them w/ the consent of the end user 
 */

util.cpath = {
	cpathar:[],
	isSaved:false
};

(function () {
    "use strict";
    
	util.cpath.pushCPath = function(str)
	{
		var now = new Date()
		var o = {
			time:	now.getFullYear()	+	'-' +
					(now.getMonth()+1) 	+ 	'-' + 
					now.getDate() 		+ 	' ' + 
					now.getHours() 		+ 	':' + 
					now.getMinutes() 	+ 	':' +
					now.getSeconds(), 
			cpath:str
		}
		this.cpathar.push(o)
	}
	
	/**
	 * @description Stores cpath locally
	 */
	util.cpath.storePath = function()
	{
		var uset = new util.userSettings("cpath")
		var oldpathstr = uset.get("cpath")
		var cpathstr = util.cpath.getPath()
		if(util.cpath.isSaved == false)
			uset.store([{key:'cpath', value:oldpathstr + cpathstr}])
		util.cpath.isSaved = true
	}
	
	
	util.cpath.getPath = function()
	{
		var cpathstr = ''
		util.forEach(util.cpath.cpathar, function(cp)
		{
			cpathstr += cp.time + " " + cp.cpath + '\n'
		})
		return cpathstr
	}
	
	util.cpath.display = function(sel)
	{
		var s = _s(sel)
		if(!util.isUndef(s))
			s.setHtml(	util.cpath.getStoredPaths() + 
						util.cpath.cpathar.joinAll(function(p){return p.time + " " + p.cpath + "\n"}))
	}
	
	util.cpath.resetPath = function()
	{
		util.cpath.cpathar = []
		util.cpath.isSaved = false	
		var uset = new util.userSettings("cpath")
		uset.store([{key:'cpath', value:''}])
	}
	
	util.cpath.getStoredPaths = function()
	{
		var uset = new util.userSettings("cpath")		
		return uset.get("cpath")
	}
	
	util.cpath.isExternalReferrer = function()
	{
		if(document.referrer)
		{
			var ref = String(document.referrer).split("/")[2]
			var loc = String(document.location).split("/")[2]
			var b = loc.equals(ref)
			return !b
		}
	}
	
	util.cpath.initCPath = function()
	{
		if(util.cpath.isExternalReferrer())
		{
			util.cpath.pushCPath(document.referrer)
			util.cpath.pushCPath(document.location)
		}

		if(window.attachEvent)
			window.attachEvent("onbeforeunload", util.cpath.storePath)
		else if(window.addEventListener)
			window.addEventListener('beforeunload', util.cpath.storePath)		
	}
})();

util.ready(function()
{
	util.cpath.initCPath()
})