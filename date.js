/**
 * 
 */

Date.prototype.format = function(locale)
{
	var s = []
	var discard = 0
	var format = locale ? locale.dateFormat : 'YYYY-MM-DD'
	for(var c = 0; c  < format.length; c++)
	{
		if(discard > 0)
		{
			discard--
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
			s.push(util.defaultStrings['day' + (this.getDay() + 1)+'short'])			
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
			s.push(util.defaultStrings['month' + (this.getMonth() + 1)+'short'])
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
