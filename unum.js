

(function () {
    "use strict";
	 
	/**
	 * For some weird and uncomprehendble reason IE9 stalls on 
	 * calling an enum an enum. So a unum was envisaged..
	 */
	util.unum = function(from, to, opt)
	{
		var ret = []	
		if(util.isUndef(opt)) var opt = {}
	
		if(isNaN(opt.step)) var step = 1
		else 
			var step = opt.step	
		
		if(util.isNumber(from) && util.isNumber(to))
		{
			for(var c = from; c <= to;)
			{
				ret.push(c)
				if(!util.isUndef(opt.optunumFlags) && opt.optunumFlags)
					if(c <= 1)
						c++
					else 
						c += c
				else
					c += step
			}
			return ret
		}	
			
		if(util.isObject(opt.regexp))
			regexp = opt.regexp
		else
			regexp = new RegExp()	
	
		if(!util.isUndef(opt.useLowercase))
			if(opt.useLowercase)
				util.unum.options.set([util.unum.option.useLowercase])
			else
				util.unum.options.set([!util.unum.option.useLowercase])
			
		if(!util.isUndef(opt.useUppercase))
			if(opt.useUppercase)
				util.unum.options.set([util.unum.option.useUppercase])
			else
				util.unum.options.set([!util.unum.option.useUppercase])
				
		if(!util.isUndef(opt.useSpecial))
			util.unum.optUseSpecial = opt.useSpecial
		
		var cb = false
		if(util.isFunction(opt.onUnumNext))
		{
			cb = opt.onUnumNext
			cb(from)
		}
		else
		{
			cb = null
			var ret = [from]
		}
		if(!util.unum.isValid(from, to))
			return ret
		
		var max = from.length 
		var s = from
		var c = 0
			do
			{	
				/* Take step times */
				s = util.unum.unumNext(s)
				if(s == to)
					break
				if(++c % step == 0 && (typeof regexp == 'undefined' || s.match(regexp)))
					if(typeof cb === 'function')
						cb(s)
					else
						ret.push(s)
			}
			while(s != to)
		if(util.isFunction(cb))
			cb(to)
		else 
			ret.push(to)
		return ret
	}
		
	util.unum.unumNext = function(str)
	{
		var max = str.length 
		var c = 1
		
		/* Count digits from the right that need to be changed */
		for(c; c <= max; c++)
		{
			if(util.unum.options.get() & util.unum.option.useSpecial)
			{
				if(str.charCodeAt(max - c) + 1 % ('~'.charCodeAt(0)-1) > ('~'.charCodeAt(0)))
					continue
			}	
			else if(util.unum.options.get() & util.unum.option.useLowercase)
			{
				if(str.charCodeAt(max - c) + 1 % ('z'.charCodeAt(0)-1) > ('z'.charCodeAt(0)))
					continue
			}
			else if(util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(str.charCodeAt(max - c) + 1 % ('Z'.charCodeAt(0)-1) > ('Z'.charCodeAt(0)))
					continue
			}		
			else if(str.charCodeAt(max - c) + 1 % ('9'.charCodeAt(0)-1) > ('9'.charCodeAt(0))) 
				continue
			 
			break 
		}
		
		var ret = ''
			
	
		/* Build answer from the left */	
		ret = str.substring(0, max - c)		
	
		/* Add changed digits to the right */
		for(; c > 0; c--)
		{
			if(c > max) ret += '0'
			else
			{
				code = util.unum._unumNext(str, max - c)
				ret += String.fromCharCode(code)
			}
		}
	
		return ret 
	}
	util.unum.unumPrev = function(str)
	{
		var max = str.length 
		var c = 1
		
		/* Count digits from the right that need to be changed */
		if(str.charCodeAt(str.length - 1) == '0'.charCodeAt(0))
		for(c; c <= max; c++)
		{
			if(util.unum.options.get() & util.unum.option.useSpecial)
			{
				if(str.charCodeAt(max - c) - 1 % ('~'.charCodeAt(0)-1) == (' '.charCodeAt(0)))
					continue
			}	
			else if(util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(str.charCodeAt(max - c) % ('Z'.charCodeAt(0)-1) == ('0'.charCodeAt(0)))
					continue
			}		
			else if(str.charCodeAt(max - c) - 1 % ('9'.charCodeAt(0)-1) == ('0'.charCodeAt(0))) 
				continue
			 
			break 
		}
		var ret = ''
	
		/* Build answer from the left */	
		ret = str.substring(0, max - c)		
	
		/* Add changed digits to the right */
		for(; c > 0; c--)
		{
				code = util.unum._unumPrev(str, max - c)
				ret += String.fromCharCode(code)
		}
	
		return ret 	
	}
	
	util.unum.unumAround = function(from, opt)
	{
		var ret = []
		if(util.isUndef(opt))
		{
			var opt = {n:2}
		}
		if(util.isUndef(opt.regexp))
			opt.regexp = new RegExp()
		if(!util.isUndef(opt.useUppercase))
			if(opt.useUppercase)
				util.unum.options.set([util.unum.option.useUppercase])
			else
				util.unum.options.set([! util.unum.option.useUppercase])	
		if(!util.isUndef(opt.useLowercase))
			if(opt.useLowercase)
				util.unum.options.set([ util.unum.option.useLowercase])
			else
				util.unum.options.set([! util.unum.option.useLowercase])
		var fromP = from
		var fromN = from
		for(var c = 0; c < opt.n * 2; )
		{
			fromP = util.unum.unumPrev(fromP)
			fromN = util.unum.unumNext(fromN)
			if(fromP.match(opt.regexp))
			{
				c++
				ret.push(fromP)
			}
			if(fromN.match(opt.regexp))
			{
				c++
				ret.push(fromN)
			}
		}
		return ret
	}
	
	util.unum._unumPrev = function(str, index)
	{
		var code = str.charCodeAt(index) - 1
	
		if(util.unum.options.get() & util.unum.option.useSpecial)
		{
			if(!util.unum.options.get() & util.unum.option.useLowercase)
			{
				if(code >= "a".charCodeAt(0) && code <= 'z'.charCodeAt(0))
					code -= ('z'.charCodeAt(0) - "a".charCodeAt(0))
			}
			if(!util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0))
					code -= ("Z".charCodeAt(0) - "A".charCodeAt(0))
			}
			if(code < " ".charCodeAt(0))
				code = "~".charCodeAt(0)
		}
		else
		{
			if(util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
					code -= ("A".charCodeAt(0) - "9".charCodeAt(0) -1)
				if(code > 'Z'.charCodeAt(0) && code < 'a'.charCodeAt(0))
					code -= ("a".charCodeAt(0) - "Z".charCodeAt(0)-1)
			}
			else if(util.unum.options.get() & util.unum.option.useLowercase)
			{
				if(code > '9'.charCodeAt(0) && code < 'a'.charCodeAt(0))
					code -= ("a".charCodeAt(0) - "9".charCodeAt(0) -1)
			}
			else
			{
				if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
					code -= ("A".charCodeAt(0) - "9".charCodeAt(0) -1)			
			}
			if(code < "0".charCodeAt(0))
				code = '9'.charCodeAt(0)
		}
		return code
	}
	util.unum._unumNext = function(str, index)
	{
		var code = str.charCodeAt(index) + 1
	
		if(util.unum.options.get() & util.unum.option.useSpecial)
		{
			if(!util.unum.options.get() & util.unum.option.useLowercase)
			{
				if(code >= "a".charCodeAt(0) && code <= 'z'.charCodeAt(0))
					code += ('z'.charCodeAt(0) - "a".charCodeAt(0))
			}
			if(!util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0))
					code += ("Z".charCodeAt(0) - "A".charCodeAt(0))
			}
			if(code > "~".charCodeAt(0))
				code = " ".charCodeAt(0)
		}
		else
		{
			if(util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
					code += ("A".charCodeAt(0) - "9".charCodeAt(0) -1)
				if(code > 'Z'.charCodeAt(0) && code < 'a'.charCodeAt(0))
					code += ("a".charCodeAt(0) - "Z".charCodeAt(0)-1)
			}
			else if(util.unum.options.get() & util.unum.option.optUseLowercase)
			{
				if(code > '9'.charCodeAt(0) && code < 'a'.charCodeAt(0))
					code += ("a".charCodeAt(0) - "9".charCodeAt(0) -1)
			}
			else
			{
				if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
					code += ("A".charCodeAt(0) - "9".charCodeAt(0) -1)			
			}
			if(util.unum.options.get() & util.unum.option.useLowercase)
			{
				if(code > "z".charCodeAt(0))
					code = "0".charCodeAt(0)
			}
			else if(util.unum.options.get() & util.unum.option.useUppercase)
			{
				if(code > "Z".charCodeAt(0))
					code = "0".charCodeAt(0)
			}
			else
				if(code > "9".charCodeAt(0))
					code = '0'.charCodeAt(0)
		}
		return code
	}
	util.unum.isValid = function(from, to)
	{
		if(!(util.unum.options.get() & util.unum.option.useLowercase) && (to.match(/[a-z]/) || from.match(/[a-z]/)))
			return false
		if(!(util.unum.options.get() & util.unum.option.useUppercase) && (to.match(/[A-Z]/) || from.match(/[A-Z]/)))
			return false
		if(!(util.unum.options.get() & util.unum.option.useSpecial) && (to.match(/[\W]/) || from.match(/[\W]/)))
			return false
	
		return true	
	}
})()
util.prepare(function(){
	util.unum.option = ['useUppercase', 'useLowercase', 'useSpecial', 
	                   'unumFlags', 'preserveFormat', 'preserveLanguage'].unum()
		                    
	util.unum.vowels = 'aeiou'
	util.unum.consonants = 'bcdfghjklmnpqrstvwxyz'

	util.unum.options = util.struct([util.options], {value:0})
	util.unum.options.set([
	     util.unum.option.preserveLanguage,
	     util.unum.option.useUppercase])
})

//Little card game setup
/*
function _init(){
	var deck = []
	var set = {A:'spade',B:'coppe', C:'denari', D:'bastoni'}

	function card()
	{
		return this
	}
	card.prototype.display = function()
	{
		alert(String(set[this.kind]).toFirstCharUppercase() + " " + this.name)
	}
	
	util.unum('A', 'D').forEach(
		function(kind)
		{
			util.unum('AA', 'AD')
			 .concat(util.unum(2, 10))
				.forEach(
					function(n)
					{
						var c = util.mixin(card, {kind:kind, name:n, value:n})
						deck.push(c)
						c.display()
					}
				)		
		}
	)
	alert(deck[0] instanceof card)	
}

util.ready(function(){_init()})
*/
/*
util.unum('1000', '1002').forEach(function(pnumber)
{
	util.unum(pnumber + 'AZ', pnumber + 'BB', 
		{
		regexp:RegExp(/\d{4}[A-Z]{2}/),
		onunumNext:function(pcode)
		{
			alert(pcode)
		}
	})
})
*/

//var o = Array('one', 'two', 'three').unum('A', 'C')
//alert(o.three)

/*
Array('hatsikadee').forEach(function(word)
{
	document.getElementsByTagName('body')[0].innerHTML += util.unum.unumAround(word, {n:word.length*13, useUppercase:false, useLowercase:true, regexp:RegExp(/^[a-z]{1,}$/)}).join(" ")	
})
*/
//alert(util.unum.unumPrev('0'))
