<?php
/*

project:	utiljs admin
author:		pieter
date: 		Mar 26, 2012

*/
define('URL', 'documentation/');

function getData()
{
	$names = array("constructor", "util.util.error");
	$files = glob("symbols" . DIRECTORY_SEPARATOR  . 
				"util.*.html");
	$dict = array();
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".Array.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".String.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".Date.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".HTMLElement.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".Math.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".Number.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".Object.html");
	array_push($files, "symbols" . DIRECTORY_SEPARATOR . ".String.html");
	
	
	
	foreach ($files as $fileName)
	{
		$entry = fileNameToDictEntry($fileName);
		if(!in_array($entry['name'], $names))
		{
			array_push($names, $entry['name']);
			array_push($dict, $entry);
		}
		$itms = fileNameToDictItems($fileName);
		foreach($itms as $i)
		{
			if(!in_array($i['name'], $names))
			{
				array_push($names, $i['name']);
				array_push($dict, $i);
			}
		}
	}
	dataOut($dict);
}

function fileNameToDictItems($fileName)
{
	$url = URL;
	$synos = array('utiljs');
	$hudEntry = true;
		
	$uri = preg_replace("/util/", "util.",
				preg_replace("/html$/", ".html", 
					str_replace(".", "", 
						str_replace(DIRECTORY_SEPARATOR, "/", $fileName))));
	$cnt = file_get_contents($uri);
	
	$itms = array();
	$dictItems = array();
	preg_match_all("/.*\\/(.*)\\.html#\\.?(\w{1,}).*/", $cnt, $itms);
	foreach($itms[1] as $item)
	{
		$entry = array(
			"url" => $url . $uri,
			"name" => $item,
			"synos" => $synos,
			"sitemapEntry" => preg_match("/^[A-Z]/", $item) || preg_match("/^util/", $item),
			"hudEntry" => $hudEntry);
		array_push($dictItems, $entry);				
	}	
	preg_match_all("/.*html#\\.?(\w{1,}).*/", $cnt, $itms);

	foreach($itms[1] as $item)
	{
		$entry = array(
			"url" => $url . $uri,
			"name" => $item,
			"synos" => $synos,
			"sitemapEntry" => preg_match("/^[A-Z]/", $item) || preg_match("/^util/", $item),
			"hudEntry" => $hudEntry		
		);
		array_push($dictItems, $entry);				
	}		
	return $dictItems;
}

function fileNameToDictEntry($fileName)
{
	$entry = array();
	$url = URL;
	$matches = array();
	preg_match_all("/.*\\.(\w*)\\.html/", $fileName, $matches);

	$hudEntry = true;
	$name = $matches[1][0];
	$synos = array('utiljs');
		
	$entry = array(
		"url" => $url . preg_replace("/util/", "util.",
							preg_replace("/html$/", ".html", 
								str_replace(".", "", 
									str_replace(DIRECTORY_SEPARATOR, "/", $fileName)))),
		"name" => $name,
		"synos" => $synos,
		"sitemapEntry" => preg_match("/^[A-Z]/", $name) || preg_match("/^util/", $name),
		"hudEntry" => $hudEntry);
	
	return $entry;	
}

function cmp($a, $b)
{
    return $b['name'] < $a['name'];
}

function dataOut($dict)
{
	usort($dict, "cmp");
	
	$outAr = array(
		"tabItems" => array(
			array(
				"name" => 'Tab1',
				"url" => 'javascript:url(1)'
			)
		),	
		"regExps" => array(
			array(
				"regExp" => "(\d{2}\\.\d{2})",
				"matchEntry" => "Array"
			),
			array(
				"regExp" => "([A-Z]\w*)",
				"matchEntry" => "Math"
			)			),
		"showMax" => 8,
		"dict" => $dict);
	echo json_encode($outAr);
}

getData();


?>