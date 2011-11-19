/**
 * 
 */

Number.prototype.format = function(as, locale)
{
	if(!util.isString(as)) var as = 'integer'
	var n = ''
	var arg = 2
	
	if(as.indexOf(":") > -1)
		arg = parseInt(as.split(":")[1])

	if(as.match(/precision/i))
	{
		n = new Number(this.valueOf()).toPrecision(arg)
	}
	if(as.match(/float/i))
	{
		n = new Number(this.valueOf()).toFixed(arg)
	}	
	else
		n = new Number(this.valueOf())
	return util._formatNumber(n, '.', ',')
}
util._formatNumber = function(number, thousand, decimal)
{
	var _s = new String(number)
	var decimalPos = _s.length - _s.indexOf(".")
	
	if(util.isString(decimal)) _s.replace(/\\\./, decimal)
	
	var s = ''
	for(var c = _s.length - 1; c > -1; c--)
	{
		if( c > decimalPos && 
			(_s.length - c - 1) % 3 == 0 && 
			_s.length != (c + 1))
		{
			s = thousand + s
		}
		s = _s[c] + s
	}
	return s
}

