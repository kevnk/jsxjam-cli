#! /usr/bin/env node

/**
 * TODO List
 * - json.modules["path/to/component"] = Array of component names
 * - json.components["componentName"].class or .const to show stateless or not (one template with big if statement)
 * - settings be merged: .jsxjamrc, then json, then cli options
 * - find a way to customize import statements (maybe es6 is default, unless other option is passed in)
 */

var ejs = require('ejs');
var path = require('path')
var fs = require('fs')
var fsPath = require('fs-path')
var program = require('commander')
var jsonfile = require('jsonfile')
var _ = require('lodash')

program
    .version('0.1.0')
    .option('-i, --input [path]', 'path to the json file to parse')
    .option('-d, --data [json string]', 'json string data you want to pass in manually')
    // TODO: context: json file or json string - data to be sent to templates
    .option('-o, --output [path]', 'path to directory where the generated JSX files end up. Defaults to ./')
    .option('-e, --ext [extension]', 'file extension used for generated JSX files. Defaults to jsx')
    .option('-s, --stateless', 'use stateless JSX template')
    .option('--stateless-template [path]', 'use your own stateless component template.')
    .option('-t, --template [path]', 'use your own component template. use --stateless-template also if you have stateless components')
    .parse(process.argv);

var outputDir = path.dirname(program.output) || './'
var jsxExt = program.ext ? program.ext.replace('.','') : 'jsx'
jsxExt = '.' + jsxExt

// Run through the JSON
var jsonFile = {
    modules: {},
    components: {},
    settings: {},
}

if (program.input) {
    var jsonFileName = program.input
    var jsonFilePath = path.resolve(process.env.PWD, jsonFileName)
    if (fs.existsSync(jsonFilePath)) {
        var jsonData = jsonfile.readFileSync(jsonFilePath)
        jsonFile = _.extend(jsonFile, jsonData)
    }
}

if (program.data) {
    try {
        var data = JSON.parse(program.data)
        jsonFile = _.extend(jsonFile, data)
    } catch(err) {
        return console.log(err);
    }
}

var modules = jsonFile.modules
var settings = jsonFile.settings
var configJsonPath = path.resolve(process.env.PWD, '.jsxjamrc')
if (fs.existsSync(configJsonPath)) {
    var configJson = jsonfile.readFileSync(configJsonPath)
    settings = _.extend(configJson, settings)
}
var baseDir = settings.baseDir || ''
var moduleComponents = {}
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
        var componentRef = jsonFile.components[componentName] || {}
        var componentProps = componentRef.component || {}
        componentProps.componentName = componentName
        var componentSettings = componentRef.settings || {}
        var isStateless = program.stateless || componentSettings.stateless
        var templatePath = isStateless ? statelessComponentPath : classComponentPath
        // Override template path if options passed in a custom template
        if (isStateless) {
            if (program.statelessTemplate) {
                templatePath = path.resolve(process.env.PWD, program.statelessTemplate)
            }
        } else {
            if (program.template) {
                templatePath = path.resolve(process.env.PWD, program.template)
            }
        }

        // Check for child components
        if (componentProps.props && Array.isArray(componentProps.props.children)) {
            componentProps.props.children.forEach(function(childComponent){
                if (jsonFile.components.hasOwnProperty(childComponent)) {
                    componentProps.children = componentProps.children || {}
                    componentProps.children[childComponent] = {
                        // TODO: error check and allow customization
                        importComponent: "import " + childComponent + " from '" + moduleComponents[childComponent].importPath + "'",
                        renderComponent: '<' + childComponent + ' />'
                    }
                }
            })
        }

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

