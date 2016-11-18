# JSX Jam

Give me a JSON file, and I will generate JSX components.  


## Install

```
npm install --save-dev jsxjam-cli
```

## Command Line Usage
```

  Usage: jsxjam <input> [options]

  <input> can be a valid json or json string

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -c, --context [json string]  pass in variables to be passed as `context` object to the template file
    -o, --output [path]          path to directory where the generated JSX files end up. Defaults to ./
    -t, --template [path]        use your own component template
    -e, --ext [extension]        file extension used for generated JSX files. Defaults to jsx
    --baseDir [path]             appended to output path where all generated files go

```

## Examples 
See [an example in action on the wiki](https://github.com/jsxjam/jsxjam-cli/wiki/Example)

#### Some tips and tricks

- The `config` property in your input JSON can also be set in a `.jsxjamrc` JSON file in the directory from which you're running the command. 

#### Component Options
__stateless__ - set to `true` and you will get the stateless version of a component  
__pureRender__ - set to `true` and the default template will import [pure-render-decorator](https://www.npmjs.com/package/pure-render-decorator) and use it  
__redux__ - set to `true` and the default template will add `connect` and `mapStateToProps()` to your component  

See these in action in [the example on the wiki](https://github.com/jsxjam/jsxjam-cli/wiki/Example)

## How to Contribute
#### Initial Setup
```
$ git clone git@github.com:jsxjam/jsxjam-cli.git
$ cd jsxjam-cli/
$ npm install
$ npm link
```

#### Hack Away
After linking, `jsxjam` becomes a global command for you to try out and hack away. 

#### Send me a pull request
Thanks!