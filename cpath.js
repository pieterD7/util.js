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
		alert(str)
		var now = new Date()
		var o = {
			time:	now.getFullYear()	+	' ' +
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
	
	}
	
	util.cpath.isExternalReferrer = function()
	{
		if(document.referrer)
		{
			var ref = document.referrer.substring(0, util.getBaseUrl().length).equals(util.getBaseUrl())
			return !ref
		}
	}
	
	util.cpath.initCPath = function()
	{
		if(util.cpath.isExternalReferrer())
		{
			util.cpath.pushCPath(document.referrer)
			util.cpath.pushCPath(document.location)
		}
		if(!String(document.location).match(document.referrer))
			util.cpath.pushCPath(document.referrer)
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