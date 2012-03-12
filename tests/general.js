// TESTS

util.test = {
	notify: 1
}
util.test.strOut = function(msg, n)
{
	if(util.test.notify == 1 && _s('div#tests'))	
		_s('div#tests').appendHtml(msg + " <a>passed (" + n + "/" + n + ")</a><br/>")	
}
util.test.errOut = function(str1, msg)
{
	if(_s('div#tests'))
		_s('div#tests').appendHtml("<font color='red'>TEST " + msg + " FAILED:</font>" + "<br/>")
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
		util.test.strOut(ts.msg, ts.tsts.length)
}
util.test.assertStr = function(str1, str2)
{		
	if(!String(str1).isEmpty() && str1 == str2)
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

util.test.assertNotNill = function(a)
{
	if(!util.isUndef(a))
		return true
	else
		return false
}

util.ready(function()
{
	// Sanity check
	util.test.runTests({
		tsts:[{test:util.test.assertNotNill, params:[document.querySelector]}],
		msg: 'Check1: document.querySelector'
	})	
	
	var d = util.createElement('div')
	d.addClassName('test1')
	d.addClassName('test2')
	d.addClassName('test1')
	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[d.getClassName(), "test1 test2"]}],
		msg: "Test1: addClassName()"
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
		msg: 'Test6: weeknumber'		
	})	

	util.test.runTests({
		tsts:[{test:util.test.assertBool, params:[util.trim(null).isEmpty(), true]},
		      {test:util.test.assertBool, params:[util.isObject(null), true]}],
		msg: 'Test7: booleans'		
	})

	util.test.runTests({
		tsts:[{test:util.test.assertStr, params:[util.trim('fits in.as many words as    . possible when first word in string is shorter then limit')
		                             			.toLimitedFormattedText(23), "Fits in. As many words ..."]},
		      {test:util.test.assertStr, params:[Number(10000).format('integer'), "10.000"]}],
		msg: 'Test8: string formatting'		
	})
	
})
