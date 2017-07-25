// node 6.11.1
//'use strict';

console.log("---- START");

var program = require('commander');
var SDVKorConverter = require('./SDVKorConverter');

program
	.option('-q, --quiet', 'don\'t output files being processed')
	.version('0.0.1');

program
	.command('toKor')
	.description('korea to russia')
	.action(function() {
		SDVKorConverter.converter("1");
	});

program
	.command('toRu')
	.description('russia to korea')
	.action(function() {
		SDVKorConverter.converter("2");
	});

program
    .action(() => program.help());

program.parse(process.argv);