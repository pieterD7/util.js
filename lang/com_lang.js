/**
 * 
 * Blueprint sample application
 * 
 */
function _initLang(lang)
{
	var strings = [
	{
		sel:'title',
		html:lang.appName.toAllFirstCharsUppercase()
	},
	{
		store:'lblQHint',
		html:lang.lblQHint.toLowerCase()
	},
	{
		sel:'#editArea form input[type=submit]',
		value:lang.btnNext
	}]
	return strings
}