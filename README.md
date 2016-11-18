# JSX Jam

Give me a JSON file, and I will generate JSX components.  


### Install

```
npm install --save-dev jsxjam-cli
```

### Command Line Usage
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

### Examples 
See [an example in action on the wiki](https://github.com/jsxjam/jsxjam-cli/wiki/Example)



### How to Contribute
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