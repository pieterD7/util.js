/** http://www.gmarts.org/index.php?go=415#easterscript
 * 	http://www.codeproject.com/KB/datetime/christianholidays.aspx
 */

util.holidays = {
	list:[],
	flags:[],
	options:null
}

Math.intDiv  = function(num, dvsr)
//performs integer division of num/dvsr - eg intDiv(9,4)=2
{
var negate = false;
var result = 0;
if (dvsr == 0)
   return null;
else {
   if (num * dvsr < 0 )
      negate = true;
   if (num < 0)
      num = -num;
   if (dvsr < 0)
      dvsr = -dvsr;
   result = ((num - (num % dvsr)) / dvsr);
   if (negate)
      return -result;
   else
      return result;
	}
}

util.holidays.init = function()
{
	util.holidays.flags = ['regional', 'national', 'christian'].unum()
	util.holidays.options = new util.struct([util.options], {value:0})	
}

util.holidays.getHolidays = function(year)
{
	var ret = false

	if(util.isObject(util._bankholidays[util.curLang]))
	{
		var tHolis = []
		var rHolis = util.bankholidays.regionalHolidays
		var cHolis = util.bankholidays.christianHolidays
		var nHolis = util.bankholidays.nationalHolidays
		ret = []
		if(util.holidays.options.value == 0)
			tHolis = cHolis.concat(nHolis).concat(rHolis).concat(cHolis)
		if(util.holidays.options.get(util.holidays.flags.regional))
			tHolis = tHolis.concat(rHolis)
		if(util.holidays.options.get(util.holidays.flags.national))
			tHolis = tHolis.concat(nHolis)
		if(util.holidays.options.get(util.holidays.flags.christian))
			tHolis = tHolis.concat(cHolis)
			
		util.forEach(tHolis, function(holi)
		{
			var day = null
			if(util.isObject(holi) && util.isFunction(util.holidays[holi.calc]))
			{
				day = util.holidays[holi.calc](year)
			}
			if(day)
				ret.push({
					name:holi.name,
					date:day 
				})
		})
	}
	return ret
}

util.holidays.EasterWestern = function(year)
{
	var wDay = false
	var wMonth = false
   var g = 0;
   var c = 0;
   var h = 0;
   var i = 0;
   var j = 0;
   var p = 0;
   g = year % 19;
   c = Math.intDiv(year, 100);
   h = (c - Math.intDiv(c, 4) - Math.intDiv(8 * c + 13, 25) + 19 * g + 15) % 30;
   i = h - Math.intDiv(h, 28) * (1 - Math.intDiv(h, 28)
      * Math.intDiv(29, h + 1) * Math.intDiv(21 - g, 11));
   j = (year + Math.intDiv(year, 4) + i + 2 - c + Math.intDiv(c, 4)) % 7;
   p = i - j + 28;
   wDay = p;
   wMonth = 4;
   if (p > 31)
      wDay = p - 31;
   else
      wMonth = 3;
   return {from:{day:wDay, month:wMonth, year:year}}
}
util.holidays.Pentecost = function(year)
{
	var e = util.holidays.EasterWestern(year)
	var ed = new Date(e.from.year,e.from.month, e.from.day + 49)
	return {from:{day:ed.getDate(),month:ed.getMonth()+1,year:year}}	
}
util.holidays.Ascension = function(year)
{
	var e = util.holidays.EasterWestern(year)
	var ed = new Date(e.from.year,e.from.month, e.from.day + 39)
	return {from:{day:ed.getDate(),month:ed.getMonth()+1,year:year}}	
}
util.holidays.Christmas = function(year)
{
	return {from:{day:25, month:12, year:year}}	
}
util.holidays._5MeiNL = function(year)
{
	return {from:{day:5, month:5, year:year}}	
}
util.holidays._3OctNL = function(year)
{
	return {from:{day:3, month:10, year:year}}	
}
util.holidays._30AprNL = function(year)
{
	return {from:{day:30, month:4, year:year}}
}
util.holidays._1Jan = function(year)
{
	return {from:{day:1, month:1, year:year}}
}

util.prepare(function()
{
	util.holidays.init()	
})

util.ready(function()
{
	/** this should be called by app in util.ready() */
	util.holidays.options.set(
		[util.holidays.flags.regional,
		 util.holidays.flags.national,
		 util.holidays.flags.christian])
			 
	util.holidays.list = util.holidays.getHolidays(new Date().getFullYear())
/*		.forEach(function(holi)
		{
			alert( 	holi.name + ' ' + 
					holi.date.from.day + ' ' + 
					holi.date.from.month)
		
		})
*/	
})
