/**
 * 
 */
/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
/* modified by pieter@nr8.nl */
	
	dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1);
	var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7);
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
 			  the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
		else
			weeknum = (weeknum+51)%52+1
		
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7)-1;
	}
	return weeknum;
};

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
			s.push(util.defaultStrings['monthsshort'][(this.getMonth())])
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

