
/** For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 *      // Week number 53 ok:
 *      see bottom
 */
Date.prototype.getWeek = function() {
   // Copy date so don't modify original
   d = new Date(this);
   ddd = new Date(this);
   d.setHours(0,0,0);
   // Set to nearest Thursday: current date + 4 - current day number
   // Make Sunday's day number 7
   d.setDate(d.getDate() + 4 - (d.getDay()||7));
   // Get first day of year
   var yearStart = new Date(d.getFullYear(),0,1);
   // Calculate full weeks to nearest Thursday
   var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
   // Return array of year and week number
   return weekNo;
}

/**
 * @param {String} format PHP-like date format
 * 
 */
Date.prototype.format = function(format)
{
	var s = []
	var discard = 0
	var format = format ? format : 'YYYY-MM-DD'
	for(var c = 0; c  < format.length; c++)
	{
		if(discard > 0)
		{
			discard--
		}
		else if(format[c] == 'W')
		{
			s.push(this.getWeek())		
		}
		else if(format[c] == 'D'  && format[c+1] == 'D')
		{
			discard++
			s.push(this.getDate())		
		}
		else if(format[c] == 'D' && (c > 0 && format[c-1] != 'D' || c == 0))
		{
			s.push(util.defaultStrings['day' + (this.getDay() + 1)])			
		}
		else if(format[c] == 'd')
		{
			s.push(util.defaultStrings['daysshort'][((this.getDay()+6)%7)])			
		}		
		else if(format[c] == 'M' && format[c+1] == 'M')
		{
			discard++
			s.push(this.getMonth() + 1)			
		}
		else  if (format[c] == 'M' && (c > 0 && format[c-1] != 'M' || c ==0))
		{
			s.push(util.defaultStrings['month' + (this.getMonth() + 1)])
		}
		else  if (format[c] == 'm')
		{
			s.push(util.defaultStrings['monthsshort'][(this.getMonth() + 1)])
		}		
		else if(format[c] == 'Y' && format[c+1] == 'Y' && format[c+2] == 'Y' && format[c+3] == 'Y')
		{
			discard += 3
			s.push(this.getFullYear())			
		}
		else if(format[c] == 'Y' && format[c+1] == 'Y')
		{
			discard++
			s.push(this.getYear() - 100)			
		}		
		else
			s.push(format[c])
	}
	return s.join('')
}