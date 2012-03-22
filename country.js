/**
 * 
 */

util.country = {};

(function(){
	"use strict";
	
	util.country.init = function(locale)
	{
		util.ajax(
		{
			url:'utiljs/countriesEurope.txt',
			onSuccess: function(data)
			{
				var c = []
				var iso = []
				var inPart = false
				var lines = data.split(RegExp("\n"))
				util.forEach(lines, function(line)
				{
					if(line.substring(0, 2) == '##')
						return
					if(line.substring(0, 2).match(/[#]\w/))
					{
						inPart = true
						c.push(line.replace("#", "").substring(0,2))
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
				var isos = iso.splice(0, iso.length / c.length)
				var ii = false
				util.forEach(c, function(_locale, i)
				{
					if(locale == _locale)
						ii = i - 1
				})
				_s('#country').setHtml('')
				util.forEach(isos, function(is, i)
				{
					var opt = util.createElement('option')
					opt.setHtml(iso[ii * 54 + i])
					opt.val(is)
					_s('#country').appendChild(opt)
				})
			}
		})
	}
})()

util.ready(function()
{
	util.country.init(util.lang)
})
