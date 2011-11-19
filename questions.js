/**
 * 	
 * 	
 * 
 */

var db = null
var forms = []
forms.push({ name: 'filloutForms', 	action: 'newFillout()'})
forms.push({ name: 'editElement', 	action: 'newElement()'})

var state = 'form99'
	
document.ready(
	function()
	{					
		if(util.isFunction(window.openDatabase)) 
		{
			db = openDatabase("psy2", "1", util.lang.appName, 200000);
			installApp()
			document.getElementById('filloutForms')
				.appendChild(newForm(forms[0].name, forms[0].action))
			
			if(hasPINCode())
			{
				_s('#login form input[name=PIN]').focus()
			}
			else
			{
				login(true)
			}
		}
		else
		{
			document.getElementById('onOff').setAttribute('style', 'display:none;')
			alert(
					'Please upgrade your browser to one with an html5 database like Chrome.\n'+ 
					'(Or something terrible has happened.)'
			)
		}
	}
)	

function installApp()
{
	var fields = 'string TEXT'
    db.transaction(function(tx)
   	{
    	tx.executeSql("create table if not exists strings(id REAL UNIQUE, " + fields + ")");
   	})		

	fields = 'q REAL, resp TEXT, time TEXT'
    db.transaction(function(tx)
    {
		tx.executeSql("create table if not exists fillouts(id REAL UNIQUE, " + fields + ")");
    })	
    
    fields = 'qType TEXT, q TEXT, qOps TEXT'
    db.transaction(function(tx)
    {
    	tx.executeSql("create table if not exists questions(id REAL UNIQUE, " + fields + ")");
    })
}
function save()
{
	db.transaction(function(tx)
	{
		tx.executeSql()
	})
}
function list()
{
	d.transaction(function(tx)
	{
		tx.executeSql('select * from table forms', 
		[],
		function(tx, rs)
		{
			
		},
		function(tx, err)
		{
			
		})
	})
}

function addSubmitBtn(formId)
{
	if(_sa('#' + formId + ' form table tr').length == 1)
	{
		var btn = document.createElement('input')
		btn.setAttribute('type', 'submit')
		btn.setAttribute('value', util.lang.btnSave)
		var tr = wrapInTr('', btn)
		_s('#' + formId + ' form table')
			.appendChild(tr)
	}
	else if(_sa('#' + formId + ' form table tr').length > 2)
	{
		if(_s('#' + formId + ' form table tr td input[type=submit]'))
			_s('#' + formId + ' form table')
				.removeChild(_s('#' + formId + ' form table tr:nth-child(' + 
				(_sa('#' + formId + ' form table tr').length - 1) + ')'))
		var btn = document.createElement('input')
		btn.setAttribute('type', 'submit')
		btn.setAttribute('value', util.lang.btnSave)
		var tr = wrapInTr('', btn)
		_s('#' + formId + ' form table ')
			.appendChild(tr)					
	}	
}

function onNewItem()
{
	var tr = document.createElement('tr')
	var td = document.createElement('td')
	switch(document.forms['edit'].type.value)
	{
		case 'openVraag':
			if(trim(document.forms['edit'].q.value) != '')
			{
				showForm(0)
				_s('#filloutForms form table')
					.appendChild(newOpenVraag(document.forms['edit'].q.value + ' : '));
				addSubmitBtn('filloutForms')
				_s('#editArea form').reset()
				setHintOnQ( util.lang.lblQHint + ' ' + (nbrOfQ() - 1))
			}
			break;
		case 'multiChoice':
			if(state != forms[1].name)
			{	
				clearForm1()				
				showForm(1)
				insertMultipleChoiceEdit();
				addSubmitBtn('editElement')
				_s('#editArea form').reset()
			}
			break;
		case 'totaalIs100':
			if(state != forms[1].name)
			{	
				clearForm1()				
				showForm(1)
				insertChoose100Edit()
				addSubmitBtn('editElement')
				_s('#editArea form').reset()
			}
			break;
		default:
			showForm(0)
	}

}
function formEls()
{
	return document.getElementById('filloutForms').childNodes[1]
}
function nbrOfFormEls()
{
	return formEls().childNodes.length	
}
function wrapInTr(leftString, html)
{
	var tr = document.createElement('tr')
	var td = document.createElement('td')
	td.innerHTML = leftString
	tr.appendChild(td)
	td = document.createElement('td')
	if(typeof html === 'object')
	{
		td.appendChild(html)
	}
	else
	{
		td.innerHTML = html
	}
	tr.appendChild(td)
	return tr
}
function newOpenVraag(str)
{
	state = forms[0].name

	var ret = '' 
	var ta = document.createElement('textarea')
	ta.setAttribute('name', nbrOfFormEls()+1)
	ret = wrapInTr(str, ta)
	return ret
}

function clearForm1()
{
	var d = document.getElementById('editElement')
	if (d.hasChildNodes())
	{
	    while(d.childNodes.length > 0)
	    {
	        d.removeChild(d.firstChild)     
	    } 
	}
}

var az = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function insertChoose100Edit()
{
	state = forms[1].name
	var f = newForm(forms[1].name, forms[1].action, 'tot100')
	var p = document.createElement('p')
	p.innerHTML = util.lang.pTot100
	document.getElementById('editElement').appendChild(p)
	
	for(var c = 0; c < 5; c++)
	{
		var opt1 = newEdit((c + 1) + ' : ', c + 1)
		f.childNodes[f.childNodes.length - 1].appendChild(opt1)
	}
	document.getElementById('editElement').appendChild(f)		
}

function insertMultipleChoiceEdit()
{
	state = forms[1].name	
	var f = newForm(forms[1].name, forms[1].action, 'multiChoice')
	var p = document.createElement('p')
	p.innerHTML = util.lang.pMultiChoice
	document.getElementById('editElement').appendChild(p)
	
	for(var c = 0; c < 5; c++)
	{
		var opt1 = newEdit(az.charAt(c) + ' : ', c + 1)
		f.childNodes[f.childNodes.length - 1].appendChild(opt1)
	}
	document.getElementById('editElement').appendChild(f)	
}
function newForm(name, action, editType)
{	
	var form = document.createElement('form')
	form.setAttribute('name', name)
	form.setAttribute('action', 'javascript:' + action)

	var hid = document.createElement('input')
	hid.setAttribute('type', 'hidden')
	hid.setAttribute('value', editType)
	hid.setAttribute('name', 'editType')
	form.appendChild(hid)	
	
	var ta = document.createElement('table')
	form.appendChild(ta)
	return form
}
function newEdit(str, name)
{
	var txt = document.createElement('input')
	txt.setAttribute('name', name)
	var tr = wrapInTr(str, txt)
	return tr
}
function hideEditForm()
{
	var bool = _s('#editArea').style.display == 'none' ? false : true
	switch(bool)
	{
		case true:
			_s('#editArea').setAttribute('style', 'display:none;')
			_s('#hideLink').innerHTML = '[meer]'
			break;
		default:
			_s('#editArea').setAttribute('style', 'display:block;')
			_s('#hideLink').innerHTML = '[minder]'	
	}
}
function newElement()
{
	
	setHintOnQ(util.lang.lblQHint + ' ' + (nbrOfQ() + 1))				
	state = 'form99'
	
}
function showForm(id)
{
	switch(id)
	{
		case 0:
			document.getElementById(forms[0].name).setAttribute('style', 'display:block;')
			document.getElementById(forms[1].name).setAttribute('style', 'display:none;')
			break
		
		case 1:
			document.getElementById(forms[1].name).setAttribute('style', 'display:block;')
			document.getElementById(forms[0].name).setAttribute('style', 'display:none;')			
			break;
	}
}

function setPIN()
{
	document.getElementById('onOff').setAttribute('style', 'display:none')
	document.getElementById('settings').setAttribute('style', 'display:block')
	_s('#settings form table tr td input[name=PINoud]').focus()
}

function hasPINCode()
{
	return false
}

function newSettings()
{
	_s('#settings form').reset()
	document.getElementById('onOff').setAttribute('style', 'display:block')
	document.getElementById('settings').setAttribute('style', 'display:none')

}

function login(access)
{
	if(util.isBool(access) && access)
	{
		document.getElementById('login').setAttribute('style', 'display:none')
		document.getElementById('onOff').setAttribute('style', 'display:block')
		setHintOnQ(util.lang.lblQHint.format([nbrOfQ()]))
	}
}

function nbrOfQ()
{
	return _sa('#filloutForms form table tr').length + 1 
}

function setHintOnQ(hint)
{
	_s('#editArea form textarea[name=q]')
		.addListener(
			'focus', 
			function()
			{
				if(this.value == hint)
				{
					_s('#editArea form textarea[name=q]')
						.setAttribute('style', 'font-style:normal;color:black;')			
					this.value = ''
				}
			}
		)
		
	if(_s('#editArea form textarea[name=q]').value == '')
	{
		_s('#editArea form textarea[name=q]')
			.setAttribute('style', 'font-style:italic;color:#808080')
		_s('#editArea form textarea[name=q]').value = hint
	}
	
}