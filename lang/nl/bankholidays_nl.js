/**
 * 
 */

util.ready(function()
{
	util._bankholidays.nl = 
	{
		christianHolidays:[
		{	name:util.defaultStrings.holidays.easter, 
			calc:'EasterWestern'},
		{	name:util.defaultStrings.holidays.pentecost, 
			calc:'Pentecost'},
		{	name:util.defaultStrings.holidays.christmas, 
			calc:'Christmas'},
		{	name:util.defaultStrings.holidays.ascension, 
			calc:'Ascension'},			
		],
		nationalHolidays:[
		{ 	name:util.defaultStrings.holidays.liberationday, 
			calc:'_5MayNL'},
		{ 	name:util.defaultStrings.holidays.queensday, 
			calc:'_30AprNL'},			
		{	name:util.defaultStrings.holidays.jan1,
			calc:'_1Jan'}
		],
		regionalHolidays:[
		{ 	name:util.defaultStrings.holidays.cities.leiden._3oct,
			calc:'_3OctNL',
			data:{region:'u173-u175'}}
		]
	}
	util.bankholidays = util._bankholidays.nl
})
