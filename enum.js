/**
 * 
 */
util.enum = function(from, to, step, regexp, opt)
{
	if(typeof step === 'undefined') var step = 1
	if(typeof opt !== 'undefined' && typeof opt.useUppercase !== 'undefined')
		util.enum.optUseUppercase = opt.useUppercase
	var ret = [from]
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

util.enum.optUseUppercase = false

util.enum.enumNext = function(str)
{
	var max = str.length 
	var c = 1
	
	/* Count digits from the right that need to be changed */
	for(c; c <= max; c++)
	{
		if(str.charCodeAt(max - c) + 1 % ('z'.charCodeAt(0)-1) > ('z'.charCodeAt(0)))
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

	if(util.enum.optUseUppercase)
	{
		if(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0))
			code += ("A".charCodeAt(0) - "9".charCodeAt(0) -1)
		if(code > 'Z'.charCodeAt(0) && code < 'a'.charCodeAt(0))
			code += ("a".charCodeAt(0) - "Z".charCodeAt(0)-1)
	}
	else
	{
		if(code > '9'.charCodeAt(0) && code < 'a'.charCodeAt(0))
			code += ("a".charCodeAt(0) - "9".charCodeAt(0) -1)
	}
	if(code > "z".charCodeAt(0))
		code = "0".charCodeAt(0)
	return code
}

//alert(util.enum('1', '10', 1, void(0), {useUppercase:false}).join('|'))