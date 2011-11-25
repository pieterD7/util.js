/**
 * 
 */

util.enum = function(from, to, step, regexp)
{
	var ret = [from]
	var max = from.length 
	var s = from
	var c = 0
		do
		{	
			/* Take step times */
			s = util.enumNext(s)
			if(s == to)
				break
			if(++c % step == 0 && (typeof regexp == 'undefined' || s.match(regexp)))
				ret.push(s)
			c++
		}
		while(s != to)
	ret.push(to)
	return ret
}
util.enumNext = function(str)
{
	var max = str.length 
	var c = 1
	
	/* Count digits from the right that need to be changed */
	for(c; c <= max; c++)
	{
		if(str.charCodeAt(max - c) + 1 % ('z'.charCodeAt(0)-1) > 'z'.charCodeAt(0))
			continue
		else break 
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
			code = util._enumNext(str, max - c)
			ret += String.fromCharCode(code)
		}
	}

	return ret 
}
util._enumNext = function(str, index)
{
	var code = str.charCodeAt(index) + 1
	if(code > '9'.charCodeAt(0) && code < 'a'.charCodeAt(0))
		code += ("a".charCodeAt(0) - "9".charCodeAt(0) - 1)
	if(code > "z".charCodeAt(0))
		code = "0".charCodeAt(0)
	return code
}

util.write = function(str)
{
	document.getElementsByTagName('body')[0].innerHTML += '<textarea>' + str + '</textarea>'
}
util.alert = function(str)
{
	alert(str)
}
	util.write(util.enum('1', '10', 1, RegExp(/\w\w/)).join('|'))
