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
				var inps = _sa("select.country")
				var set = []
				util.forEach(inps, function(_inp)
				{
					var inp = new HTMLElement(_inp)
					inp.setHtml('')
					var opt = util.createElement('option')
					opt.setHtml(_inp.getAttribute('placeholder'))
					opt.val('')
					inp.appendChild(opt)
					util.forEach(isos, function(is, i)
					{
						set.push({iso:is, txt:iso[ii * 54 + i]})
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
					
				})
			}
		})
	}
})()

util.ready(function()
{
	util.country.init(util.lang)
})
