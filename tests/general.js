// TESTS

util.test = {
	notify: 0,
	totalTests:0,
	totalTestsPassed:0
}
util.test.strOut = function(msg, n)
{
	if(util.test.notify == 1 && _s('#tests'))	
		_s('#tests').appendHtml(msg + " <a>" + util.lang.tests_passed + "&nbsp;(" + n + "/" + n + ")</a><br/>")	
}
util.test.errOut = function(str1, msg)
{
	if(_s('#tests'))
		_s('#tests').appendHtml("<font color='red'>TEST " + msg + " FAILED:</font>" + String(str1).escapeRegExpSpecialChars()+ "<br/>")
}
util.test.runTests = function(ts)
{
	var pass = false
	util.forEach(ts.tsts, function(t)
	{
		if(util.isFunction(t.test))
		{
			pass = t.test(t.params[0], t.params[1])
			if(! pass)
				util.test.errOut(t.params[0], ts.msg)
		}
	})
	if(pass)
	{
		util.test.totalTestsPassed += ts.tsts.length
		util.test.strOut(ts.msg, ts.tsts.length)
	}
	util.test.totalTests += ts.tsts.length
}
util.test.assertStr = function(str1, str2)
{		
	if(!String(str1).isEmpty() && 
		String(str1).equals(str2))
	{
		return true
	}
	else
		return false
}
util.test.assertBool = function(b1, b2)
{
	if(util.isBool(b1) && util.isBool(b2) && b1 == b2)
		return true
	else
		return false
}
util.test.assertNumber = function(b1, b2)
{
	if(util.isNumber(b1) && b1 == b2)
		return true
	else
		return false
}
util.test.assertNotNill = function(a)
{
	if(!util.isUndef(a))
		return true
	else
		return false
}

util.test.run = function(noti)
{
	util.test.notify = noti
	_s('#tests').setHtml('')
	// Sanity check
	util.test.runTests({
		tsts:[{test:util.test.assertNotNill, params:[document.querySelector]}],
		msg: util.lang.tests_check1
	})	
	
	var d = util.createElement('div')
	d.addClassName('test1 test2')
	//d.addClassName('test2')
	d.addClassName('test1')

	var dd = util.createElement('div')
	dd.addClassName('test1')
	dd.addClassName('test2')
	dd.removeClassName('test2')
	
	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[d.getClassName(), "test1 test2"]},
		      {test:util.test.assertStr, params:[dd.getClassName(), "test1"]}],
		msg: "Test1: add/removeClassName()"
	})
	
	var n = util.toJson("[{'name':'pieter\'s'},{'name':'lo\\\\pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")
	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[n[0].name, "pieter's"]},
		      {test:util.test.assertStr, params:[n[2].name,'Kilo zei:"Hoera!"']},
		      {test:util.test.assertStr, params:[n[1].name, "lo\\pi"]}],
		msg: "Test2: quotes in json input"
	})
	var s = [1, 2, 3, 3].unique().join()
	//util.test.assertStr(s, "1,2,3", "Test5: array")

	var s2 = [{name:'ik'},{name:'ik'}, {name:'pieter'}].unique('name').joinEach('name', '|')
	//util.test.assertStr(s, "ik|pieter", 'Test6: array')
	
	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[s, "1,2,3"]},
		      {test:util.test.assertStr, params:[s2, "ik|pieter"]}],
		msg: 'Test3: array'
	})


	var s = util.toDirection(5.4, 53, 5.3, 52)

	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[s, "s"]}],
		msg: 'Test4: direction'		
	})

	var s = util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue
	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[s, "&"]}],
		msg: 'Test5: ampersand in xml input'		
	})

	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[new Date('2009', '11', '31').getWeek(), "53"]},
		      {test:util.test.assertStr, params:[new Date('2014', '11', '29').getWeek(), "1"]},
		      {test:util.test.assertStr, params:[new Date('2012', '0', '1').getWeek(), "52"]}],
		msg: 'Test6: iso weeknumber'		
	})	

	util.test.runTests({
		tsts:[{test:util.test.assertBool, params:[util.trim(null).isEmpty(), true]},
		      {test:util.test.assertBool, params:[util.isObject(null), true]}],
		msg: 'Test7: booleans'		
	})

	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[util.trim('fits in.as many words as    . possible when first word in string is shorter then limit')
		                             			.toLimitedFormattedText(23), "Fits in. As many words ..."]},
		      {test:util.test.assertStr, params:[Number(10000).format('integer'), "10,000"]}],
		msg: 'Test8: string formatting'		
	})	
	
	var a = ['optionFoo', 'optionBar', 'optionBaz'].unum()
	util.test.runTests({
		tsts:[{test:util.test.assertNumber, params:[a.optionFoo, 1]},
		      {test:util.test.assertNumber, params:[a.optionBar, 2]},
		      {test:util.test.assertNumber, params:[a.optionBaz, 4]}],
		  msg:"Test9: enum"
	})	
	if(util.test.notify == 0)
	{
		var div = util.createElement('div')
		div.setHtml("Tests passed: " + util.test.totalTestsPassed + "/" + util.test.totalTests + " ")
		var a = util.createElement('a')
		a.setHtml('show report')
		a.setAttribute('href', 'javascript:util.test.run(1)')
		div.appendChild(a)
		_s('#tests').appendChild(div)		
	}	
}

util.ready(function()
{
	util.test.run(0)
})
