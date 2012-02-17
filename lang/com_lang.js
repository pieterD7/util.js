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
		sel:'#chatbox input[type=button]',
		value:lang.submit
	}]
	return strings
}