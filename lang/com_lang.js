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
		sel:'.border h1',
		html:lang.cardsTitle.toFirstCharUppercase()
	},
	{
		sel:'input[name=date111]',
		placeholder:lang.pickupDate.toFirstCharUppercase()
	},
	{
		sel:'input[name=date2]',
		placeholder:lang.deliveryDate.toFirstCharUppercase()
	},
	{
		sel:'input[name=text1]',
		placeholder:lang.name.toFirstCharUppercase()
	},
	{
		sel:'select[name=country1]',
		placeholder:lang.country1.toFirstCharUppercase()
	},
	{
		sel:'input[name=currency1]',
		placeholder:lang.currency1.toFirstCharUppercase()
	},	
	{
		sel:'input[type=submit]',
		value: lang.submit
	},
	{
		sel:'#chatbox input[type=button]',
		value:lang.chatSubmit.toFirstCharUppercase()
	},
	{
		sel:'#tab1',
		html:'DERRDE'
	}]
	return strings
}