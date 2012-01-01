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
		sel:'#editArea p',
		html:lang.pEditArea.toFirstCharUppercase() + ' :'
	},
	{	
		sel:'#editArea table td:first-child',
		html:lang.lblQ 
	},
	{
		sel:'#editArea table tr:first-child + tr td',
		html:lang.lblSelectType 
	},
	{
		sel:'#settings form table tr td:first-child',
		html:lang.lblPinCode
	},
	{
		sel:'#login form table tr td:first-child',
		html:lang.lblPinCode + ' :'
	},
	{
		sel:'#settings form table tr:first-child+tr td',
		html:lang.lblNewPinCode + ' :'		
	},
	{
		sel:'#editArea form select option[value=first]',
		html:lang.optFirst
	},
	{
		sel:'#editArea form select option[value=openVraag]',
		html:lang.optOpenQ
	},
	{
		sel:'#editArea form select option[value=multiChoice]',
		html:lang.optMultiQ
	},
	{
		sel:'#editArea form select option[value=totaalIs100]',
		html:lang.opt100Q
	},
	{
		sel:'#editArea form select option[value=sectieHeader]',
		html:lang.optHeader
	},
	{
		sel:'#editArea form input[type=submit]',
		value:lang.btnNext
	},	
	{
		sel:'#tbDashboard',
		html:lang.tbDashboard.toFirstCharUppercase()
	},
	{	
		sel:'#tbSettings',
		html:lang.tbSettings.toFirstCharUppercase()
	},
	{
		sel:'#hideLink',
		html:lang.tbLess
	},
	{	
		store:'tbMore',
		html:lang.tbMore
	},
	{	
		store:'tbLess',
		html:lang.tbLess
	}]
	return strings
}