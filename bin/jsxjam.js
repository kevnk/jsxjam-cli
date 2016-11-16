#! /usr/bin/env node
var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')
var program = require('commander')

program
    .version('0.1.0')
    .option('-i, --input [path]', 'path to the json file to parse. Defaults to jsxjam.json')
    .option('-o, --output [path]', 'directory where you want your generated jsx files to end up. Defaults to ./')
    .parse(process.argv);

var jsonFileName = program.input || 'jsxjam.json'
var jsonFilePath = path.resolve(process.env.PWD, jsonFileName)
var outputDir = program.output || './'
var outputDirPath = path.resolve(process.env.PWD, outputDir)

// Run through the JSON
jsonfile.readFile(jsonFilePath, function(err, obj) {
    console.log(obj)
})
