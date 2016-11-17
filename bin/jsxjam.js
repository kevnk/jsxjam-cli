#! /usr/bin/env node
var ejs = require('ejs');
var path = require('path')
var fs = require('fs')
var fsPath = require('fs-path')
var program = require('commander')
var jsonfile = require('jsonfile')

program
    .version('0.1.0')
    .option('-i, --input [path to json]', 'path to the json file to parse. Defaults to jsxjam.json')
    .option('-o, --output [path to dir]', 'directory where the generated JSX files end up. Defaults to ./')
    .option('-e, --ext [extension]', 'file extension used for generated JSX files. Defaults to jsx')
    .option('-s, --stateless', 'use stateless JSX template')
    .parse(process.argv);

var jsonFileName = program.input || 'jsxjam.json'
var jsonFilePath = path.resolve(process.env.PWD, jsonFileName)
var outputDir = program.output || './'
var jsxExt = program.ext ? program.ext.replace('.','') : 'jsx'
jsxExt = '.' + jsxExt

var moduleComponents = {}

// Run through the JSON
var jsonFile = jsonfile.readFileSync(jsonFilePath)
var modules = jsonFile.modules || {}
var settings = jsonFile.settings || {}
var baseDir = settings.baseDir || ''
for (var moduleName in modules) {
    if (jsonFile.modules.hasOwnProperty(moduleName)) {
        var module = jsonFile.modules[moduleName]
        var components = module.components || []
        components.forEach(function(componentName) {
            var importPath = path.join('..', '..', moduleName, 'components', componentName)
            moduleComponents[componentName] = {
                importPath: importPath,
                moduleName: moduleName,
            }
        })
    }
}

var classComponentPath = path.resolve(__dirname, '..', 'templates', 'components', 'classComponent.jsx')
var statelessComponentPath = path.resolve(__dirname, '..', 'templates', 'components', 'statelessComponent.jsx')

for (var componentName in moduleComponents) {
    if (moduleComponents.hasOwnProperty(componentName)) {
        var component = moduleComponents[componentName]
        var moduleName = component.moduleName
        var filePath = path.join(process.env.PWD, outputDir, baseDir, moduleName, 'components', componentName + jsxExt)
        var ref = jsonFile.components[componentName] || {}
        var componentProps = ref.component || {}
        var componentSettings = ref.settings || {}
        var isStateless = program.stateless || componentSettings.stateless
        var templatePath = isStateless ? statelessComponentPath : classComponentPath

        try {
            var contents = fs.readFileSync(templatePath, '')
            var result = ejs.render(contents.toString(), componentProps)
            fsPath.mkdirSync(path.dirname(filePath))
            fsPath.writeFileSync(filePath, result)
            console.log(componentName, '-->', path.join(baseDir, moduleName, 'components', componentName + jsxExt))
        } catch(err) {
            return console.log(err);
        }
    }
}

