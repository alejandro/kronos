# Kronos

A dead simple project scheme maker to initialize project in node.js

## Installation

    $ npm install kronos -g

Then: 

    $ kronos PROJECTNAME
    $ cd PROJECTNAME
    $ node index

Go to [localhost:8000](http://127.0.0.1:8000) and it should respond 

    " I'm PROJECTNAME and you"

## Usage:

    Usage: kronos [options] <name>

      Options:

        -h, --help     output usage information
        -V, --version  output the version number
        -e, --empty    empty project just the squeleton without git init or files
        -g, --git      Use git for initiliaze project
        -f, --full     Default config setup git project with squeleton and everything

## Squeleton

    \
     |- lib/
         \
          |- PROJECTNAME.js
     |- bin/
         \
          |- BINFILE
     |- examples/
     |- test/
     |- index.js
     |- package.json
     |- README.md

## Example

When no params or `f` is passed some files are created with the follow header

    #!/usr/bin/env node

    /*
     * PROJECTNAME
     * @date:Fri Jan 06 2012 16:04:52 GMT-0600 (CST)
     * @name: index.js
     * @licence: MIT
    */

By default a git repo it's been set. If you pass `g` as params with `e` only the squeleton is generated and added to the repo

The initial commit looks like this:

    * 46180b9 2012-01-06 | [kronos] Initial Commit (HEAD, master) [alejandromg]

## Contributors

- [Alejandro Morales][1]


[1]: http://alejandromorales.co.cc "Homepage"

## Licence

MIT