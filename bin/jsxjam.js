#! /usr/bin/env node
var fsPath = require('fs-path')
var path = require('path')
var jsonfile = require('jsonfile')
var program = require('commander')

program
    .version('0.1.0')
    .option('-i, --input [path]', 'path to the json file to parse. Defaults to jsxjam.json')
    .option('-o, --output [path]', 'directory where the generated JSX files end up. Defaults to ./')
    .option('-e, --ext [extension]', 'file extension used for generated JSX files. Defaults to jsx')
    .parse(process.argv);

var jsonFileName = program.input || 'jsxjam.json'
var jsonFilePath = path.resolve(process.env.PWD, jsonFileName)
var outputDir = program.output || './'
var jsxExt = program.ext ? program.ext.replace('.','') : 'jsx'
jsxExt = '.' + jsxExt

var moduleComponents = {}

// Run through the JSON
jsonfile.readFile(jsonFilePath, function(err, obj) {
    var modules = obj.modules || {}
    var settings = obj.settings || {}
    var baseDir = settings.baseDir || ''
    for (var moduleName in modules) {
        if (obj.modules.hasOwnProperty(moduleName)) {
            var module = obj.modules[moduleName]
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

    for (var componentName in moduleComponents) {
        if (moduleComponents.hasOwnProperty(componentName)) {
            var component = moduleComponents[componentName]
            var moduleName = component.moduleName
            var filePath = path.join(process.env.PWD, outputDir, baseDir, moduleName, 'components', componentName + jsxExt)

            var componentFile = ''
                + "import React from 'react'"
                + '\n' + "class " + componentName + " extends React.Component {"
                + '\n' + "    render() {"
                + '\n' + "        return <div className=\"" + componentName + "\">" + componentName + "</div>"
                + '\n' + "    }"
                + '\n' + "}"
                + '\n'
                + '\n' + "export default " + componentName

            // TODO: use options to fsPath.removeSync(path.dirname(filePath))
            fsPath.mkdirSync(path.dirname(filePath))
            fsPath.writeFileSync(filePath, componentFile)
            console.log(componentName, '-->', path.join(baseDir, moduleName, 'components', componentName + jsxExt))
        }
    }

})
