// TESTS

util.test = {
	notify: 1
}
util.test.strOut = function(msg)
{
	if(util.test.notify == 1)	
		_s('div#tests').appendHtml("Test " + msg + " passed<br/>")	
}
util.test.errOut = function(str1, msg)
{
	_s('div#tests').appendHtml("<font color='red'>TEST " + msg + " FAILED:</font>" + str1 + "<br/>")
}
util.test.assertStr = function(str1, str2, msg)
{		
	if(!String(str1).isEmpty() && String(str1).match(new RegExp("^"+str2+"$")))
	{
		this.strOut(msg)
	}
	else
		this.errOut(str1, msg)
}
util.test.assertBool = function(b1, b2, msg)
{
	if(util.isBool(b1) && util.isBool(b2) && b1 == b2)
		this.strOut(msg)
	else
		this.errOut(b1, msg)
}

util.ready(function()
{
	var d = util.createElement('div')
	d.addClassName('test1')
	d.addClassName('test2')
	d.addClassName('test1')
	util.test.assertStr(d.getClassName(), "test1 test2", "Test1: addClassName()")

	var n = util.toJson("[{'name':'pieter\'s'},{'name':'lo\\\\pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")
	util.test.assertStr(n[0].name, "pieter's", "Test2: quotes in json input")
	util.test.assertStr(n[2].name, 'Kilo zei:"Hoera!"', 'Test3: quotes in json input')
	util.test.assertStr(n[1].name, "lo\\\\pi", 'Test4: slashes in json input')

	var s = [1, 2, 3, 3].unique().join()
	util.test.assertStr(s, "1,2,3", "Test5: array")

	var s = [{name:'ik'},{name:'ik'}, {name:'pieter'}].unique('name').joinEach('name', '|')
	util.test.assertStr(s, "ik|pieter", 'Test6: array')

	var s = util.toDirection(5.4, 53, 5.3, 52)
	util.test.assertStr(s, "s", 'Test7: richting')

	var s = util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue
	util.test.assertStr(s, "&", 'Test8: ampersand in xml input')
	
	// Week number 53 ok:
	util.test.assertStr(new Date('2009', '11', '31').getWeek(), "53", "Test9: iso weeknr 53")
	// Week nummer 1 ok:
	util.test.assertStr(new Date('2014', '11', '29').getWeek(), "1", "Test10: iso weeknr 1")
	// Week nummer 52 ok:
	util.test.assertStr(new Date('2012', '0', '1').getWeek(), "52", "Test11: iso weeknr 52")
	
	// Validatie:
	util.test.assertBool(util.trim(null).isEmpty(), true, "Test12 booleans")
	util.test.assertBool(util.isObject(null), false, "Test13 booleans")
	
	// Strings
	util.test.assertStr(util.trim('fits in.as many words as    . possible when first word in string is shorter then limit')
			.toLimitedFormattedText(23),
	"Fits in. As many words ...", "Test14: string formatting")
	
	//throw(new util.error("ERROR_OK"))

})
