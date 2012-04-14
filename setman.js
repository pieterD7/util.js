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
			util.datepicker.onUpdateLocale()	
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
}

util.setman.settings = function(sel, n)
{
	var html = ''
	util.forEach(util._mods, function(m)
	{
		if(typeof util[m] == 'object')
			if(typeof util[m].flags == 'object')
			{
				switch(m)
				{
					case 'datepicker':
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
						html += "<br/>Date format : " +
							"<select " +
							"	onchange='util.setman.updateDatePickerFormat(this)'" + 
							"	name='dateFormat' >" +
							"<option>Select date format</option>" +
							"<option value='d DD M YYYY'>" + 
							new Date().format('d DD M YYYY') + "</option>" +
							"<option value='(W) d DD M YYYY'>" + 
							new Date().format('(W) d DD M YYYY') + "</option>" +							
							"<option" +  
							"	value='wkW D DD M' >" + 
							new Date().format("wkW D DD M", false) + "</option>"
							"</select>"
						html += '</div>'
						break
					}
				}
			}
	})
	_s(sel).setHtml("<br/>SETTINGS<br/>" + html)
	if(!util.isUndef(n))
		util.tablayout.showTab(n)
}

