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

util.currency.format = function(num)
{
	return String(num).replace(
			RegExp(util.dataDecimalSeparator),
			util.locale.decimalSeparator)
}

util.ready(function()
{
})