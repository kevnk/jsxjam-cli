# JSX Jam

I'm an npm cli tool. Give me a JSON file, and I will generate JSX components.  
  
__FYI: currently in development!__


### Install

```
npm install --save-dev jsxjam-cli
```

### Command Line Usage
```

  Usage: jsxjam [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --input [path]     path to the json file to parse. Defaults to jsxjam.json
    -o, --output [path]    directory where the generated JSX files end up. Defaults to ./
    -e, --ext [extension]  file extension used for generated JSX files. Defaults to jsx

```

### Example `jsxjam.json` file
```
{
    "modules": {
        "myModule": {
            "components": ["MyComponent"]
        },
        "otherModule": {
            "components": ["AnotherComponent"]
        }
    },
    "components": {
        "MyComponent": {
            "component": {
                "displayName": "MyComponent",
                "initialState": {},
                "defaultProps": {},
                "propTypes": {},
                "props": {
                    "children": ["AnotherComponent"]
                }
            }
        },
        "AnotherComponent": {
            "component": {
                "displayName": "AnotherComponent"
            },
            "settings": {
                "stateless": true
            }
        }
    },
    "settings": {
        "baseDir": "src/scripts"
    }
}
```


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