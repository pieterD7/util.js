/**
 * @class util.country
 * @description Populates select elements with ISO country codes and label 
 * @example
 * &lt;select class='country' placeholder='Please select a country'>&lt;/select>
 * util.ready(function()
 * {
 * 	util.country.initSelectClassCountry('select.country', 'enus', 'countriesUSA.txt') 
 * })
 */

util.country = {};

(function(){
	"use strict";
	
	/**
	 * @description Populates select elements 
	 * @param {String} sel Selector to elements
	 * @param {String} locale ISO country code without separator 
	 * @param {String} url Path to data file 
	 */
	util.country.initSelectClassCountry = function(sel, locale, url)
	{
		var url = url || ('/' + url)
		url = util.getBaseUrl() + url
		if(util.isUndef(locale))
			var locale = 'en'
		util.ajax(
		{
			url:url,
			onSuccess: function(data)
			{
				util.eventHandler(function()
				{
					var c = []
					var iso = []
					var inPart = false
					var lines = data.split(RegExp("\n"))
					util.forEach(lines, function(line)
					{
						line = line.replace("\r", '')
						if(line.substring(0, 2) == '##')
							return
						if(line.substring(0, 2).match(/[#]\w/))
						{
							inPart = true
							c.push(line.replace("#", ""))
						}
						else if(line.substring(0, 1) == '#')
						{
							inPart = false
						}
						else if(inPart)
						{
							iso.push(line)
						}					
					})
					// Check ok?
					if(!(c.length && iso.length && iso.length > c.length) ||
						(iso.length % c.length != 0))
							throw new util.error(
								"Error reading " + iso.length + 
								" lines in  " + 
								c.length + " equal sections")
					
					var isos = iso.splice(0, iso.length / c.length)
					var ii = false
					util.forEach(c, function(_locale, i)
					{
						if(locale == _locale)
							ii = i - 1
					})				
					
					var inps = _sa(sel)
					util.forEach(inps, function(_inp)
					{
						// Save value
						var val = _inp.value
						var set = []
						var inp = new HTMLElement(_inp)						
						inp.setHtml('')
						var opt = util.createElement('option')
						opt.setHtml(_inp.getAttribute('placeholder'))
						opt.addClassName('valueishint') // doesn't do much (Chrome)
						opt.val('')
						inp.appendChild(opt)
						util.forEach(isos, function(is, i)
						{
							set.push({iso:is, txt:iso[ii * isos.length + i]})
						})
						set.sort(function(a, b)
						{
							if(b.txt < a.txt)
								return 1
							else if(b.txt > a.txt)
								return -1
							return 0
						})
						util.forEach(set, function(cntr)
						{
							var opt = util.createElement('option')
							opt.setHtml(cntr.txt)
							opt.val(cntr.iso)
							inp.appendChild(opt)
						})
						// Restore value
						var i = new HTMLElement(_inp)
						i.val(val)
					})
				})
			}
		})
	}
})()

