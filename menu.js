/**
 *	Menu for hud data
*/

(function () {
    "use strict";

    util.menuHandlers = []   
    util.index = "^index\.html|^index\.php"
    	
    util.menu = function(){

    	};

	/**
	 * @description registers handler for menu click so the handler can be found by its name
	 * @param {object} m menu handler object w/ 'name' and 'cb' properties
	 * @example
	 * util.menu.registerMenuHandler({name:'util.menu.notify', cb:util.menu.notify})
	 */
	util.menu.prototype.registerMenuHandler = function(m)
	{
		if(util.isFunction(m.cb))	
			util.menuHandlers.push(m)
	}
	
	/**
	 * @description Checks if url is in context of hud item. Context items 
	 * can be immediatedly preceded w/ ! for negations
	 * @param {String} url Url to check
	 * @param {String} context String w/ | separated contexts
	 * @returns {boolean}
	 */
	
	util.isInContext = function(url, context)
	{
		var cntxtar = String(context).split("|")
		var incontext = false
		
		// Is negated?
		var b = cntxtar.find('!'+url)
		if(b)
			return false
		var b = cntxtar.find(url)
		if(b) incontext = true
		return incontext	
	}
	
	/**
	 * @description Checks if last url is in context
	 * @param {String} context String w/ | separated contexts
	 */
	util.lastUrlIsInContext = function(context)
	{
		return util.isInContext(this.lastUrl, context)
	}
	
	/**
	 * @description Check if current document name is in context
	 * @param {String} context String w/ | separated contexts
	 */
	util.documentNameIsInContext = function(context)
	{
		var docName = util.getDocumentNameFromUrl() || util.index
		return util.isInContext(docName, context)
	}

	/**
	 * @description Returns filename from document.location.pathname or empty string
	 * @returns {String} filename
	 */
	util.getDocumentNameFromUrl = function()
	{
		return document.location.pathname.replace(/^.*[\\\/]/, '')	
	}
	
	/**
	 * @description Checks if url or lastUrl is active
	 */
	util.isActiveLink = function(url, lastUrl)
	{
		var bb = false
		var lastUrl = lastUrl || util.lastUrl
		var url = url.split(":").splice(0,3).join(":") 
		
		if(util.isString(lastUrl))
		{
			if(String(lastUrl).match(RegExp(url)))
				bb = true
		}	
		if(util.getDocumentNameFromUrl().match(RegExp(url.escapeRegExpSpecialChars())) ||
			(util.getDocumentNameFromUrl().isEmpty() && url.match(RegExp(this.index))))
				bb = true
	
		return bb
	}
	
	
	/**
	 * @description Follows a link. If the link is a menuhandler it redraws the tab bar and icons
	 * @param {String} url http url or javascript:name-of-registered-menuhandler:param
	 */
	util.follow = function(url, cpath)
	{
		// Is link to current page? (Let states be refreshable however)
		if(util.getDocumentNameFromUrl().equals(url))
			return
		
		util.eventHandler(function()
		{
			// Push cpath
			if(cpath)
				util.cpath.pushCPath(cpath)
							
			// Need to find menu handler or is it an http url?
			if(String(url).match(/^javascript:/))
			{
				// follow registered menuhandler if any
				var urlar = url.split(':')
				var param = urlar[2] || null
				var b = util.menuHandlers.find(urlar[1], 'name')
				if(b)
				{
					// Run and adjust state
					util.forEach(b, function(bb)
					{
						if(!util.isUndef(urlar[3]))
							bb.cb(param, urlar[3])
						else
							bb.cb(param)
						util.lastUrl = url	
					})
				}
				util.forEach(util.menuHandlers, function(h)
				{
					if(util.isBool(h.fireAlways) && h.fireAlways)
					{
						h.cb(url)
					}
				})
			}
			else
				// follow not javascript http uris
				document.location.href = url
		})
	}
	
	util.menu.prototype.notify = function(str)
	{
		alert("Notification " + str)
	}
	
})();

util.ready(function()
{
//	util.menu.registerMenuHandler({name:'util.menu.notify', cb:util.menu.notify})

})