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
		sel:'#editArea form input[type=submit]',
		value:lang.btnNext
	}]
	return strings
}