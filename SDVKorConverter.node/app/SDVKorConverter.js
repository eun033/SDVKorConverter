// node 6.11.1
//'use strict';

var fs = require('fs');
var moment = require('moment');

var timer = function(){};
timer.prototype = {
	start: function(){
		this._time = moment(new Date().getTime());
	},
	end: function(){
		return moment(new Date().getTime()).diff(this._time);
	}
}

Object.prototype.getKeyByValue = function( value ) {
	for( var prop in this ) {
		if( this.hasOwnProperty( prop ) ) {
			if( this[ prop ] === value )
				return prop;
		}
	}
	return false;
};

var KOR_TBL = "./app/resource/Table.tbl";
var KOR_DIR = "./korea/";
var RUS_DIR = "./russia/";

var KOR_DIC = {};
var LINE = "\n";

function initDic(){
	var data = fs.readFileSync(KOR_TBL, 'UCS-2');
	var line = data.split("\n");
	line.forEach(function(s){
		var s = s.trim() ,ca = s.split("");
		if(s != ""){
			var key = ca[0], val = ca[2];
			KOR_DIC[key] = val;
		}
	});
	console.log("0. Dic init count : ",Object.keys(KOR_DIC).length);
}

function converter(arg) {
	var method = "";
	var dirInput = "", dirOutput = "";
	// default
	initDic();
	if(arg == "toKor" || arg == "1") {
		method = "1";
		dirInput = RUS_DIR;	dirOutput = KOR_DIR;
		console.log(method + ". Russia to Korea");
	} else if(arg == "toRu" || arg == "2") {
		method = "2";
		dirInput = KOR_DIR;	dirOutput = RUS_DIR;
		console.log(method + ". Korea to Russia");
	} else {
		return "";
	}

	
	// to file list
	console.log("\t+ input file\t: " + dirInput);
	var inputHs = [];
	var files = fs.readdirSync(dirInput, 'UTF-8');
	files.forEach(function(file) {
		inputHs.push(file);
		console.log("\t\t"+file);
	});
	
	console.log("");
	// from create file
	if(inputHs.length > 0) {
		console.log("\t+ output file\t: " + dirOutput);
		inputHs.forEach(function(fnm) {
			var fnm_output = dirOutput + fnm;
			var fnm_input = dirInput + fnm;
			
			var fw = fs.createWriteStream(fnm_output, {flags: 'w'});
			
			var data = fs.readFileSync(fnm_input, 'UTF-8');
			var line = data.split("\n");
			var t = new timer;
			t.start();
			line.forEach(function(s){
				//console.log("before",s);
				if(s.trim() != ""){
					s = converter_process(arg,s);
				}
				//console.log("after",s);
				
				fw.write(s+LINE);
			});
			
			fw.end();
			console.log("\t\t" + fnm + " finish :: " + t.end());
		});
	}
}

function converter_process(method, str){
	if(method == "1") {
		return KoreaConverter(str);
	}
	return RussiaConverter(str);
}

function KoreaConverter(text){
	var output = "", arr = text.split('');
	arr.forEach(function(c){
		if (KOR_DIC.getKeyByValue(c) != false) {
			output += KOR_DIC.getKeyByValue(c);
		} else {
			output += c;
		}
	});
	return output;
}

function RussiaConverter(text){
	var output = "", arr = text.split('');
	arr.forEach(function(c){
		if (Object.keys(KOR_DIC).indexOf(c) > -1) {
			output += KOR_DIC[c];
		} else {
			output += c;
		}
	});
	return output;
}

module.exports = {
	initDic
	,converter
	,converter_process
	,KoreaConverter
	,RussiaConverter
};
