/**
 * 
 */

util.setman = {
};

util.setman._init = function()
{
	util.setman.userSettings = new util.userSettings('localeSet')		
}

util.setman.updateSettings = function(o)
{
	switch(o.name)
	{
		case 'datepicker':
			util.setman.updateDatePickerSet(o.value)
			break
		case 'combobox':
			break
	}
}

util.setman.updateDatePickerSet = function(val)
{
	util.forEach(util.datepicker.dPickers, function(dp)
	{	
		var val2 = val
		dp.data.options.set([val2])
		util.datepicker.options.set([val2])
	})
}

util.setman.updateDatePickerFormat = function(o)
{
	util.setman.userSettings.store([{key:'datePickerDateFormat', value:o.value}])
	util.datepicker.onUpdateLocale()
}

util.setman.settings = function(sel, n)
{
	var html = ''
	util.forEach(util._mods, function(m)
	{
		if(typeof util[m] == 'object')
			if(typeof util[m].flags == 'object')
			{
				html += "<div id='setman'>" + String(m).toFirstCharUppercase() + ':'
				for(var i in util[m].flags)
				{
					var isSet = util[m].options.get(util[m].flags[i])
					isSet ? checked = 'checked' : checked = ''
					var name = m 
					html += '<br/>' + 
							"<input name='" + m + "'" +
							" 	onchange='util.setman.updateSettings(this)' " +
							" 	type='checkbox' " + checked + 
							" 	value='" + util[m].flags[i] + "'/>" +  i 				
				}
				if(m == 'datepicker')
				{
					html += "<br/>Date format : " +
							"<input type='text' " +
							"	name='dateFormat' " +
							"	value='" + util.datepicker.getDatePickerDateFormat() + "'" + 
							"	onchange='util.setman.updateDatePickerFormat(this)'/>"
				}
				html += '<br/><br/></div>'
			}
	})
	_s(sel).setHtml("<br/>SETTINGS<br/>" + html)
	if(!util.isUndef(n))
		util.tablayout.showTab(n)
}

