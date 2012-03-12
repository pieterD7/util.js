/**
 *	Menu for hud data
 */

util.menu = {
	menuHandlers:[],
	lastUrl:null,
	index:"^index\.html|^index\.php"
}

/**
 * @description registers handler for menu click so the handler can be found by its name
 * @param {object} m menu handler object w/ 'name' and 'cb' properties
 * @example
 * util.menu.registerMenuHandler({name:'util.menu.notify', cb:util.menu.notify})
 */
util.menu.registerMenuHandler = function(m)
{
	if(util.isFunction(m.cb))	
		util.menu.menuHandlers.push({name:m.name,cb:m.cb})
}

/**
 * @description Checks if url is in context of hud item. Context items 
 * can be immediatedly preceded w/ ! for negations
 * @param {String} url Url to check
 * @param {String} context String w/ | separated contexts
 * @returns {boolean}
 */

util.menu.isInContext = function(url, context)
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
util.menu.lastUrlIsInContext = function(context)
{
	return util.menu.isInContext(util.menu.lastUrl, context)
}

/**
 * @description Check if current document name is in context
 * @param {String} context String w/ | separated contexts
 */
util.menu.documentNameIsInContext = function(context)
{
	var docName = util.getDocumentNameFromUrl() || util.menu.index
	return util.menu.isInContext(docName, context)
}

/**
 * @description Checks if url or lastUrl is active
 */
util.menu.isActiveLink = function(url, lastUrl)
{
	var bb = false

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
util.menu.follow = function(url, cpath)
{
	// Is link to current page? (Let states be refreshable however)
	if(util.getDocumentNameFromUrl().equals(url))
		return
	
	util.eventHandler(function()
	{
		// Push cpath
		if(cpath)
			util.cpath.pushCPath(cpath)
			
		// Split url and join first two elements
		// and store as lastUrl
		this.lastUrl = url.split(":").slice(0,2).join(':')
		
		// Need to find menu handler or is it an http url?
		if(String(url).match(/^javascript:/))
		{
			// follow registered menuhandler if any
			var urlar = url.split(':')
			var b = util.menu.menuHandlers.find(urlar[1], 'name')
			if(b)
			{
				// Run and adjust state
				b[0].cb(urlar.slice(2).join(":"))
				if(util.hud)
					util.hud.initTabBar(url)
				if(util.icons)
					util.icons.display(url)
			}
		}
		else
			// follow not javascript http uris
			document.location.href = url
	})
}

util.menu.notify = function(str)
{
	alert("Notification " + str)
}

util.menu.showMap = function(place)
{
	util.gmaps.setMap("#gmap")
}

util.ready(function()
{
	util.menu.registerMenuHandler({name:'util.menu.notify', cb:util.menu.notify})
	util.menu.registerMenuHandler({name:'util.menu.showMap', cb:util.menu.showMap})

})