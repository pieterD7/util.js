/**
 * 
 */

util.currency = {
	currency: 'EUR',
	cPickers: null
}

util.currency.setCurrency = function(currency)
{
	util.currency.currency = currency
}

util.currency.initInputTypeCurrency = function()
{
	var curs = _sa('input[type=currency]')
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('name')
		
		// Add onfocus handler
		c.addListener('focus', function()
		{
			var val = _s('input[name=' + name + ']').val()
			var i = new HTMLElement(this)
			i.val(val)
		})
		
		// Add onblur handler
		c.addListener('blur', function()
		{
			var i = new HTMLElement(this)
			_s('input[name=' + name + ']').val(
				util.trim(
					String(i.val())
						.replace(RegExp(String(util.locale.decimalSeparator).escapeRegExpSpecialChars()), '.')
						.replace(RegExp(util.currency.currency), '')))
			i.val(util.trim(
				util.currency.format(
					String(i.val()).replace(util.currency.currency, ''))))
		})		
		
		// Insert hidden fields
		var hid = util.createElement('input')
		hid.setAttribute('type', 'hidden')
		hid.setAttribute('name', name)
		hid.val(c.val())
		c.val(util.currency.format(c.val()))
		c.setAttribute('name', '')
		c.setAttribute('rel', name)
		c.getNode().parentNode.appendChild(hid.getNode())
		
		var hid = util.createElement('input')
		hid.setAttribute('type', 'hidden')
		hid.setAttribute('name', name + '_iso_code')
		hid.val(util.currency.currency)
		c.getNode().parentNode.appendChild(hid.getNode())
	})
}

util.currency.onUpdateLocale = function()
{
	var curs = _sa('input[type=currency]')
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('rel')
		var hid = _s('input[name=' + name + ']')
		c.val(util.currency.format(hid.val()))
	})
}

util.currency.format = function(num, b)
{
	var cur = util.currency.currency + " "
	if(!util.isUndef(b) && b)
		cur = ''
	if(util.locale.currencyAfterNumber)
		return String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
			+ " " + cur
	else
		return cur + String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
}

util.ready(function()
{
})