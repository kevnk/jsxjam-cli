#! /usr/bin/env node
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var fsPath = require('fs-path');
var program = require('commander');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var colors = require('colors');

function makeRed(text) {
    return colors.red(text);
}

function getCleanComponentPath(componentPath) {
    return _.trim(componentPath).replace(' ','');
}

function getComponentPathParts(componentPath) {
    var cleanPath = getCleanComponentPath(componentPath);
    return cleanPath.split('/');
}

function getComponentNameFromPath(componentPath) {
    var pathParts = getComponentPathParts(componentPath);
    return pathParts[pathParts.length - 1];
}

function getImportStr(componentPath, parentComponentPath) {
    var componentName = getComponentNameFromPath(componentPath);
    var componentPathParts = getComponentPathParts(componentPath);
    var parentPathParts = getComponentPathParts(parentComponentPath);
    var relPath = '';
    for (var i = parentPathParts.length - 1; i > 0; i--) {
        relPath += '../';
    }
    var importPath = path.join(relPath, componentPathParts.join('/'));
    return "import " + componentName + " from '" + importPath + "'";
}

function getRenderStr(componentPath) {
    var componentName = getComponentNameFromPath(componentPath);
    return '<' + componentName + ' />';
}

program
    .version('1.1.2')
    .usage('<input> [options]')
    .description('<input> can be a valid json or json string')
    .option('-c, --context [json string]', 'pass in variables to be passed as `context` object to the template file')
    .option('-o, --output [path]', 'path to directory where the generated JSX files end up. Defaults to ./')
    .option('-t, --template [path]', 'use your own component template')
    .option('-e, --ext [extension]', 'file extension used for generated JSX files. Defaults to jsx')
    .option('--baseDir [path]', 'appended to output path where all generated files go')
    .parse(process.argv);

//-- Get the options
var context = program.context ? JSON.parse(program.context) : {};
var output = program.output || process.env.PWD;
var templatePath = path.resolve(__dirname, '..', 'templates', 'component.jsx');
var jsxExt = program.ext ? program.ext.replace('.','') : 'jsx';
jsxExt = '.' + jsxExt;


//-- Get the JSON
var json = {
    components: {},
    config: {}
};
if (!program.args[0]) return program.outputHelp(makeRed);
var input = program.args[0];
var jsonFilePath = path.resolve(process.env.PWD, input);
try {
    if (fs.existsSync(jsonFilePath)) {
        json = _.extend(json, jsonfile.readFileSync(jsonFilePath));
    } else {
        json = JSON.parse(input);
    }
} catch(err) {
    console.log(makeRed('Invalid JSON: ' + err));
    return;
}


//-- Get the config
// TODO: DRY this up and allow all options to from any source
// Config from options
var optionsConfig = { output: output };
if (program.context) {
    optionsConfig.context = context
}
try {
    var template = program.template ? path.resolve(process.env.PWD, program.template) : templatePath;
    if (fs.existsSync(template)) {
        optionsConfig.template = template;
    } else {
        throw new Error('Invalid template file: ' + template);
    }
} catch(err) {
    console.log(makeRed(err));
    return;
}
if (program.ext) {
    optionsConfig.ext = jsxExt;
}
if (program.baseDir) {
    optionsConfig.baseDir = program.baseDir;
}

// Config from json input
var jsonConfig = json.config || {};
try {
    if (jsonConfig.template) {
        var templatePath = path.resolve(process.env.PWD, jsonConfig.template)
        if (fs.existsSync(template)) {
            jsonConfig.template = templatePath
        } else {
            throw new Error('Invalid template file: ' + jsonConfig.template)
        }
    }
} catch(err) {
    console.log(makeRed(err));
}

// Config from .jsxjamrc
var rootConfig = {};
try {
    var rcFilePath = path.resolve(process.env.PWD, '.jsxjamrc');
    if (fs.existsSync(rcFilePath)) {
        rootConfig = jsonfile.readFileSync(rcFilePath);
        if (rootConfig.template) {
            var templatePath = path.resolve(process.env.PWD, rootConfig.template)
            if (fs.existsSync(template)) {
                rootConfig.template = templatePath
            } else {
                throw new Error('Invalid template file: ' + rootConfig.template)
            }
        }
    }
} catch(err) {
    console.log(makeRed('Invalid .jsxjamrc JSON: ' + err));
}

// Merge it all together
var config = _.extend(rootConfig, jsonConfig, optionsConfig);


//-- Generate some jsx files!!!
Object.keys(json.components).forEach(function(componentPathStr) {
    var componentName = getComponentNameFromPath(componentPathStr);
    var defaultComponent = {
        displayName: componentName,
        state: {},
        defaultProps: {},
        propTypes: {},
    };
    var componentData = json.components[componentPathStr];
    var component = _.extend(defaultComponent, componentData.component);
    var componentPath = getCleanComponentPath(componentPathStr);
    var filePath = path.resolve(config.output, config.baseDir || '', componentPath + jsxExt);
    var children = {};
    if (component.props && Array.isArray(component.props.children)) {
        component.props.children.forEach(function(childComponent) {
            if (json.components.hasOwnProperty(childComponent)) {
                var importComponent = getImportStr(childComponent, componentPath);
                var renderComponent = getRenderStr(childComponent);
                children[childComponent] = {
                    component: json.components[childComponent],
                    importComponent: importComponent,
                    renderComponent: renderComponent,
                };
            }
        });
    }

    var meta = _.clone(componentData);
    delete meta.component;

    var fullContext = {
        config: config,
        componentName: componentName,
        componentPath: componentPath,
        children: children,
        components: json.components,
        component: component,
        meta: meta,
        context: context,
    };

    try {
        var contents = fs.readFileSync(config.template, '');
        var result = ejs.render(contents.toString(), fullContext);
        fsPath.mkdirSync(path.dirname(filePath));
        fsPath.writeFileSync(filePath, result);
        console.log(componentName, '-->', filePath);
    } catch(err) {
        console.log(makeRed(err));
        return;
    }
});
