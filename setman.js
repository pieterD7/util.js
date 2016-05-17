/**
 * @class util.setman
 * @description Manager of user settings. Provides a method 
 * for boolean settings. This is overruled by a method called "showSettings"
 * in the module returning html markup as a string. Updates the settings in 
 * the modules and in their local storage object. Calls 
 * "onUpdateLocale" if exists in the module. Provides also a method to 
 * restore all default settings. 
 */

util.setman = {
	layout:null,		// Layout class
	icon:'settings.png'
};

(function(){
	"use strict"
	
	/**
	 * @description Restore defaults
	 */
	util.setman.clearAllLocalStorage = function()
	{
		util.eventHandler(function()
		{
			util.forEach(util._mods, function(m)
			{
				m = util.prepareModName(m)
				if(util.isObject(util[m]))
				{
					for(var i in util[m])
					{
						if(util[m][i] instanceof util.userSettings)
						{
							util[m][i].clear()
							
							if(util.isDebug)
								console.log("Clearing",m,i)
						}
					}
				}
			})
			document.location.reload()
		})
	}

	/**
	 * @description Sets the option to the module
	 * @param {Object} o Checkbox object w/ name set to short name of 
	 * the module, eg. 'setman', and value set to the numerical value
	 * of the flag. 
	 */
	util.setman.updateSettings = function(o)
	{
		util.eventHandler(function()
		{
			o.name = o.name.replace(/^[_]/, '')
			switch(o.name)
			{
				default:
					if(util.isObject(util[o.name].options))
					{
						util[o.name].options.set([o.value])
					}
					if(util.isObject(util[o.name].userSet))
					{
						util[o.name].userSet.store([{
							key:'options', 
							value:util[o.name].options.get()}
						])
					}
					if(util.isFunction(util[o.name].onUpdateLocale))
						util[o.name].onUpdateLocale()
			}		
		})
	}

	/**
	 * @description Shows the boolean options to the module
	 * @param {String} m Name of the module 
	 * @returns {String} html markup
	 */
	util.setman.showSettings = function(m)
	{
		var html = ''
		var checked = ''
		var unpubs = util[m].unpublishedFlags || []

		for(var i in util[m].flags)
		{
			if(unpubs.find(i))
				continue
			var isSet = util[m].options.get(util[m].flags[i])
			isSet ? checked = 'checked' : checked = ''
			var name = m 
			var inp =
				"<input name='_" + m + "'" +
				" 	onchange='util.setman.updateSettings(this)' " +
				" 	type='checkbox' " + checked + 
				" 	value='" + util[m].flags[i] + "'/>"
			html +=  '<br/>'
			if(util.theme.getTheme().labelBeforeCheckbox )
			{
				html += i + inp
			}
			else
			{
				html += inp + i
			}
		}	
		return html
	}

	/**
	 * @description Shows all user editable settings
	 * @returns {Array} Array of util.content.ContentItem's
	 */
	util.setman.settings = function()
	{
		var items = []
		var html = "", html2 = ""
		util.forEach(util._mods, function(m)
		{
			m = util.prepareModName(m)
			if(typeof util[m] == 'object')
				if(typeof util[m].flags == 'object')
				{
					switch(m)
					{
						default:
							html = "<br/>" + m.toFirstCharUppercase() + ':'
							if(util.isFunction(util[m].showSettings))
								html2 = util[m].showSettings() + '<br/>'
							else
								html2 = util.setman.showSettings(m)
						var item = new util.content.ContentItem()
						item.name = m
						item.header = m
						item.icon = util.setman.icon
						item.body = html + html2
						if(!html2.isEmpty())
							items.push(item)
					}
				}
		})
		var item = new util.content.ContentItem()
		html = "<div id='setman'>"
		html += "<br/><a href='javascript:util.setman.clearAllLocalStorage()'>restore defaults</a><br/>"
		html += '</div>'
		item.header = "Settings"
		item.body = html
		item.icon = util.setman.icon	
		item.name = "settings"
		items.push(item)
		return items
	}
	
})()
