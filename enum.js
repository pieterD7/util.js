/**
 * 
 */
util.enum = function(from, to, opt)
{
	if(typeof opt === 'undefined') var opt = {}

	if(typeof opt.step === 'undefined') var step = 1
	else
		var step = opt.step
		
	if(typeof opt.regexp === 'object')
		regexp = opt.regexp

	if(typeof opt.useLowercase !== 'undefined')
		util.enum.optUseLowercase = opt.useLowercase	
		
	if(typeof opt.useUppercase !== 'undefined')
		util.enum.optUseUppercase = opt.useUppercase

	if(typeof opt.useSpecial !== 'undefined')
		util.enum.optUseSpecial = opt.useSpecial
				
	var ret = [from]
	
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
				ret.push(s)
		}
		while(s != to)
	ret.push(to)
	return ret
}

util.enum.optUseLowercase = false
util.enum.optUseUppercase = true
util.enum.optUseSpecial = false

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

/*
var pobjects = []

util.enum('1', '2').forEach(function(pnumber)
{
	util.enum(pnumber + '000AZ', pnumber + '000BA', {regexp:RegExp(/\d\d\d\d[A-Z]{2}/)})
		.forEach(function(parea)
			{
				var pobj = new util.struct([String], {pcode:parea})
				pobj.print = function()
				{
					alert(this.data.pcode)
				}
				pobjects.push(pobj)
			})
})

pobjects.forEach(function(o)
{
	o.print()
})
*/
//alert(util.enum('1000AX', '1000BA').join('|'))