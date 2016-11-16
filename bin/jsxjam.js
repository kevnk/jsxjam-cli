#! /usr/bin/env node
console.log("=== Starting JSXjam session ===")

var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')

/* Options */
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
const jsonFileName = process.argv[2] || 'jsxjam.json'
const jsonFilePath = path.resolve(process.env.PWD, jsonFileName)
const outputDir = process.argv[3] || process.env.PWD
const outputDirPath = path.resolve(process.env.PWD, outputDir)

/* Settings */
// TODO: find .jsxjamrc config file
// TODO: override settings from command line options

/* Build some JSX files */
// TODO: find template path from settings/options

// Run through the JSON
jsonfile.readFile(jsonFilePath, function(err, obj) {
    console.log(obj)
})

console.log("=== JSXjam session complete ===")