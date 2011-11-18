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
		html:util.lang.appName.toAllFirstCharsUppercase()
	},
	{
		sel:'#editArea p',
		html:util.lang.pEditArea.toFirstCharUppercase()
	},
	{	
		sel:'#editArea table td:nth-child(1)',
		html:util.lang.lblQ + ' :'
	},
	{
		sel:'#editArea table tr:nth-child(2) td',
		html:util.lang.lblSelectType + ' :'
	},
	{
		sel:'#settings form table tr td:nth-child(1)',
		html:util.lang.lblPinCode + ' :'
	},
	{
		sel:'#login form table tr td:nth-child(1)',
		html:util.lang.lblPinCode + ' :'
	},
	{
		sel:'#settings form table tr:nth-child(2) td',
		html:util.lang.lblNewPinCode + ' :'		
	},
	{
		sel:'#editArea form select option[value=first]',
		html:util.lang.optFirst
	},
	{
		sel:'#editArea form select option[value=openVraag]',
		html:util.lang.optOpenQ
	},
	{
		sel:'#editArea form select option[value=multiChoice]',
		html:util.lang.optMultiQ
	},
	{
		sel:'#editArea form select option[value=totaalIs100]',
		html:util.lang.opt100Q
	},
	{
		sel:'#editArea form select option[value=sectieHeader]',
		html:util.lang.optHeader
	},
	{
		sel:'#editArea form input[type=submit]',
		value:util.lang.btnNext
	},	
	{
		sel:'#tbDashboard',
		html:util.lang.tbDashboard.toFirstCharUppercase()
	},
	{	
		sel:'#tbSettings',
		html:util.lang.tbSettings.toFirstCharUppercase()
	},
	{
		sel:'#hideLink',
		html:util.lang.tbLess
	}]
	return strings
}