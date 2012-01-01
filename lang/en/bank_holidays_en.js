/**
 * 
 */

util.prepare(function()
{
	util._bankholidays.en = 
	{
		christianHolidays:[
		{	name:util._defaultStrings.en.holidays.easter, 
			calc:'EasterWestern'},
		{	name:util._defaultStrings.en.holidays.pentecost, 
			calc:'Pentecost'},
		{	name:util._defaultStrings.en.holidays.christmas, 
			calc:'Christmas'},
		{	name:util._defaultStrings.en.holidays.ascension, 
			calc:'Ascension'},			
		],
		nationalHolidays:[
		{ 	name:util._defaultStrings.en.holidays.liberationday, 
			calc:'_5MayNL'},
		{ 	name:util._defaultStrings.en.holidays.queensday, 
			calc:'_30AprNL'},			
		{	name:util._defaultStrings.en.holidays.jan1,
			calc:'_1Jan'}
		],
		regionalHolidays:[
		{ 	name:util._defaultStrings.en.holidays.cities.leiden._3oct,
			calc:'_3OctNL',
			data:{region:'u173-u175'}}
		]
	}
	util.bankholidays = util._bankholidays.en
})
