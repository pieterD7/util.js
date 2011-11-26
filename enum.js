/**
 * 
 */
util.enum = function(from, to, opt)
{
	if(util.isUndef(opt)) var opt = {}

	if(util.isUndef(opt.step)) var step = 1
	else
		var step = opt.step	
	
	if(util.isNumber(from) && util.isNumber(to))
	{
		var ret = []
		for(var c = from; c <= to; c += step)
		{
			ret.push(c)
		}
		return ret
	}	
		
	if(util.isObject(opt.regexp))
		regexp = opt.regexp
	else
		regexp = new RegExp()	

	if(!util.isUndef(opt.useLowercase))
		util.enum.optUseLowercase = opt.useLowercase	
		
	if(!util.isUndef(opt.useUppercase))
		util.enum.optUseUppercase = opt.useUppercase

	if(!util.isUndef(opt.useSpecial))
		util.enum.optUseSpecial = opt.useSpecial
	
	var cb = false
	if(util.isFunction(opt.onEnumNext))
	{
		cb = opt.onEnumNext
		cb(from)
	}
	else
	{
		cb = null
		var ret = [from]
	}
	if(!util.enum.isValid(from, to))
		return ret
	
	var max = from.length 
	var s = from
	var c = 0
		do
		{	
			/* Take step times */
			s = util.enum.enumNext(s)
			if(s == to)
				break
			if(++c % step == 0 && (typeof regexp == 'undefined' || s.match(regexp)))
				if(typeof cb !== 'function')
					ret.push(s)
				else if(typeof cb === 'function')
					cb(s)
		}
		while(s != to)
	if(!util.isFunction(cb))		
		ret.push(to)
	else if(util.isFunction(cb))
		cb(to)
	return ret
}

/* @return Object */
Array.prototype.enum = function(from, to, opt)
{
	var ret = {}
	var c = 0
	var e = util.enum(from, to, opt)
	this.forEach(
		function(p)
		{
			ret[p] = e[c++]
		})
	return ret
}

util.enum.optUseLowercase = false
util.enum.optUseUppercase = true
util.enum.optUseSpecial = false

var optsPreserveFormat = ['noformat', 'preserveFormat', 'preserveLanguage'].enum(0, 2)
util.enum.optPreserveFormat = optsPreserveFormat.preserveLanguage

util.enum.vowels = 'aeiou'
util.enum.consonants = 'bcdfghjklmnpqrstvwxyz'

util.enum.enumNext = function(str)
{
	var max = str.length 
	var c = 1
	
	/* Count digits from the right that need to be changed */
	for(c; c <= max; c++)
	{
		if(util.enum.optUseSpecial)
		{
			if(str.charCodeAt(max - c) + 1 % ('~'.charCodeAt(0)-1) > ('~'.charCodeAt(0)))
				continue
		}	
		else if(util.enum.optUseLowercase)
		{
			if(str.charCodeAt(max - c) + 1 % ('z'.charCodeAt(0)-1) > ('z'.charCodeAt(0)))
				continue
		}
		else if(util.enum.optUseUppercase)
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
			code = util.enum._enumNext(str, max - c)
			ret += String.fromCharCode(code)
		}
	}

	return ret 
}
util.enum.enumPrev = function(str)
{
	var max = str.length 
	var c = 1
	
	/* Count digits from the right that need to be changed */
	if(str.charCodeAt(str.length - 1) == '0'.charCodeAt(0))
	for(c; c <= max; c++)
	{
		if(util.enum.optUseSpecial)
		{
			if(str.charCodeAt(max - c) - 1 % ('~'.charCodeAt(0)-1) == (' '.charCodeAt(0)))
				continue
		}	
		else if(util.enum.optUseUppercase)
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
		if(c > max) ret += '0'
		else
		{
			code = util.enum._enumPrev(str, max - c)
			ret += String.fromCharCode(code)
		}
	}

	return ret 	
}

util.enum.enumAround = function(from, opt)
{
	var ret = []
	if(util.isUndef(opt))
	{
		var opt = {n:2}
	}
	if(util.isUndef(opt.regexp))
		opt.regexp = new RegExp()
	if(!util.isUndef(opt.useUppercase))
		util.enum.optUseUppercase = opt.useUppercase
	if(!util.isUndef(opt.useLowercase))
		util.enum.optUseLowercase = opt.useLowercase

	var fromP = from
	var fromN = from
	for(var c = 0; c < opt.n * 2; )
	{
		fromP = util.enum.enumPrev(fromP)
		fromN = util.enum.enumNext(fromN)
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

util.enum._enumPrev = function(str, index)
{
	var code = str.charCodeAt(index) - 1

	if(util.enum.optUseSpecial)
	{
		if(!util.enum.optUseLowercase)
		{
			if(code >= "a".charCodeAt(0) && code <= 'z'.charCodeAt(0))
				code -= ('z'.charCodeAt(0) - "a".charCodeAt(0))
		}
		if(!util.enum.optUseUppercase)
		{
			if(code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0))
				code -= ("Z".charCodeAt(0) - "A".charCodeAt(0))
		}
		if(code < " ".charCodeAt(0))
			code = "~".charCodeAt(0)
	}
	else
	{
		if(util.enum.optUseUppercase)
		{
			if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
				code -= ("A".charCodeAt(0) - "9".charCodeAt(0) -1)
			if(code > 'Z'.charCodeAt(0) && code < 'a'.charCodeAt(0))
				code -= ("a".charCodeAt(0) - "Z".charCodeAt(0)-1)
		}
		else if(util.enum.optUseLowercase)
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
util.enum._enumNext = function(str, index)
{
	var code = str.charCodeAt(index) + 1

	if(util.enum.optUseSpecial)
	{
		if(!util.enum.optUseLowercase)
		{
			if(code >= "a".charCodeAt(0) && code <= 'z'.charCodeAt(0))
				code += ('z'.charCodeAt(0) - "a".charCodeAt(0))
		}
		if(!util.enum.optUseUppercase)
		{
			if(code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0))
				code += ("Z".charCodeAt(0) - "A".charCodeAt(0))
		}
		if(code > "~".charCodeAt(0))
			code = " ".charCodeAt(0)
	}
	else
	{
		if(util.enum.optUseUppercase)
		{
			if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
				code += ("A".charCodeAt(0) - "9".charCodeAt(0) -1)
			if(code > 'Z'.charCodeAt(0) && code < 'a'.charCodeAt(0))
				code += ("a".charCodeAt(0) - "Z".charCodeAt(0)-1)
		}
		else if(util.enum.optUseLowercase)
		{
			if(code > '9'.charCodeAt(0) && code < 'a'.charCodeAt(0))
				code += ("a".charCodeAt(0) - "9".charCodeAt(0) -1)
		}
		else
		{
			if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
				code += ("A".charCodeAt(0) - "9".charCodeAt(0) -1)			
		}
		if(util.enum.optUseLowercase)
		{
			if(code > "z".charCodeAt(0))
				code = "0".charCodeAt(0)
		}
		else if(util.enum.optUseUppercase)
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
util.enum.isValid = function(from, to)
{
	if(!util.enum.optUseLowercase && (to.match(/[a-z]/) || from.match(/[a-z]/)))
		return false
	if(!util.enum.optUseUppercase && (to.match(/[A-Z]/) || from.match(/[A-Z]/)))
		return false
	if(!util.enum.optUseSpecial && (to.match(/[\W]/) || from.match(/[\W]/)))
		return false

	return true	
}

//Little card game setup
/*
var deck = []
var set = {A:'spade',B:'coppe', C:'denari', D:'bastoni'}

function card()
{
	return this
}
card.prototype.display = function()
{
	alert(set[this.data.kind] + " " + this.data.name)
}

util.enum('A', 'D')
 .forEach(
	function(kind)
	{
		util.enum('AA', 'AD')
		 .concat(util.enum(2, 10))
			.forEach(
				function(n)
				{
					var c = new util.struct([card], {kind:kind, name:n, value:n})
					deck.push(c)
				}
			)		
	}
)
*/

/*
util.enum('1000', '1002').forEach(function(pnumber)
{
	util.enum(pnumber + 'AZ', pnumber + 'BB', 
		{
		regexp:RegExp(/\d{4}[A-Z]{2}/),
		onEnumNext:function(pcode)
		{
			alert(pcode)
		}
	})
})
*/

//var o = Array('one', 'two', 'three').enum('A', 'C')
//alert(o.three)

/*
Array('hatsikadee').forEach(function(word)
{
	document.getElementsByTagName('body')[0].innerHTML += util.enum.enumAround(word, {n:word.length*13, useUppercase:false, useLowercase:true, regexp:RegExp(/^[a-z]{1,}$/)}).join(" ")	
})
*/

