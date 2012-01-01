/**
 * 
 */

util.prepare(function()
{
	util._bankholidays.nl = 
	{
		christianHolidays:[
		{	name:util._defaultStrings.nl.holidays.easter, 
			calc:'EasterWestern'},
		{	name:util._defaultStrings.nl.holidays.pentecost, 
			calc:'Pentecost'},
		{	name:util._defaultStrings.nl.holidays.christmas, 
			calc:'Christmas'},
		{	name:util._defaultStrings.nl.holidays.ascension, 
			calc:'Ascension'},			
		],
		nationalHolidays:[
		{ 	name:util._defaultStrings.nl.holidays.liberationday, 
			calc:'_5MayNL'},
		{ 	name:util._defaultStrings.nl.holidays.queensday, 
			calc:'_30AprNL'},			
		{	name:util._defaultStrings.nl.holidays.jan1,
			calc:'_1Jan'}
		],
		regionalHolidays:[
		{ 	name:util._defaultStrings.nl.holidays.cities.leiden._3oct,
			calc:'_3OctNL',
			data:{region:'u173-u175'}}
		]
	}
	util.bankholidays = util._bankholidays.nl
})
