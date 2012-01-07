#!/usr/bin/env node

/*
 * Kronos
 * @author: Alejandro Morales <vamg008@gmail.com>
 * @date: 6-ene-2012
 * @name: kronos.js
 * @licence: MIT
*/

var fs      = require('fs'), 
    exec    = require('child_process').exec, 
    mkdirp  = require('mkdirp'),
    program = require('commander'),
    pname   = '';




var write = function(path, str) {
  fs.writeFile(path, str);
  log('echo ' + path, 'info');
};

var mkdir = function(path, name) {
  mkdirp('./'+path+ '/' + name, 0755, function(err,data){
    if (err){
      log('');
      log(err.message, 'warn');
      log('NOT OK','warn');
      process.kill();
    } 
    log('created ' + './' + name + '/' + name,'info');
  });
  
};

var touch = function (path,name){
  exec("touch ./" + path + '/'+name, function(err, data){
    if (err) {
      log('');
      log(err, 'warn');
      log('NOT OK','warn');
      process.kill();
    } 
    log('created ./' + path + '/' + name , 'info');
  });
};


var createDirs = function(names){
  names.forEach(function(name){
    try {
      fs.stat('./' + name, function(err,stat){
        if (err && err.message.substr(0,6)=== 'ENOENT'){
          var toMkdir = ["lib","bin","test","examples"];
          toMkdir.forEach(function(dir){
            mkdir(name, dir);
          });
        } else if (err) {
          log('');
          log(err, 'warn');
          log('NOT OK', 'warn');
          process.kill();
        } else if (program.force){
          exec("rm -rf ./"+name, function(er,resp){
            if (er){
              log('');
              log(er, 'warn');
              log('NOT OK', 'warn');
              process.kill();
            } else {
              createDirs([name]);
            }
          });
        } else {
          log('');
          log('Dir ' + name + ' cannot be create becuase already exists', 'warn');
          log('set -f to force the operation', 'warn');
          log('NOT OK', 'warn');
          process.kill();
        }
      });
    } catch(excp) {
      log(excp);
      log('Not OK','warn');
      process.kill();
    }
  });
};

var touchFiles = function(names,ss){
  ss = arguments.length === 2? true:false;
  names.forEach(function(name){
    try {
      var files = ["index.js","package.json","README.md","History.md",
      "bin/" + name , "lib/" + name + ".js"]
      files.forEach(function(file){
        touch(name, file);
        // I hate this Timeout but happen that mkdir actions is too slow sometimes
        setTimeout(function(){
          if (ss && (files.length -1) === files.indexOf(file)){
            if (ss && (names.length -1) === names.indexOf(name)) {
              log('Ok','success');
            }
          }
        },100);
      });
    } catch(excp){
      log(excp,'warn');
      log('Not OK','warn');
      process.stdin.destroy();
    }
  });
};

var git = function(names,ss){
  // just in case that ss it's not defined
  ss = arguments.length === 2 ? true : false;
  names.forEach(function(name){
    var location = process.env.PWD + '/' + name;
    try {
      exec([
        "cd " + location,
        " && git init " + location ,
        " && git add .",
        " && git commit -am '[kronos] Initial Commit'"
        ].join(''), function(err,data){
          if (err){
            log(err,'warn');
            log('Not OK','warn');
            process.stdin.destroy();
          } else {
            log('initialized repo ' + name , 'info');
            if ( ss && (names.length -1)=== names.indexOf(name)) {
              log('Ok','success');
            }
          }
        });
    } catch(excp){
      log(excp,'warn');
      log('Not OK','warn');
      process.stdin.destroy();
    }
  });
};

var echo = function(names){
  names.forEach(function(name){
    toWrite.forEach(function(file){
      write(process.env.PWD + '/' + name + '/' + file.name, file.content );
    });
  });
};

var project = function(empty,tgit) {
  if (pname.length === 0) {
    log('Invalid project name','warn');
    log('Not OK','warn');
    process.stdin.destroy();
  } else {
    createDirs(pname);
    setTimeout(function(){
      if (empty) {
       // setup dir
        if (empty && !tgit){
          touchFiles(pname,true);
        } else if (empty && tgit) {
          touchFiles(pname);
          git(pname, true);
        } else {
          log('I don\'t know what to do' ,'warn');
          process.stdin.destroy();
        }
      } else {
        touchFiles(pname);
        // wait sometimes echoed to file takes a lit bit long
        setTimeout(function(){
          echo(pname);
          git(pname,true);
          }, 200);
      }
    }, 200);
  } 
};

// Just a simple logger
var log = function(msg, level){

  var color = ['',''],
      brand = "\033[90m" + " [kronos]   : " + "\033[39m";

  if (level === 'info') {
    color=["\033[36m", "\033[39m"];
  } else if(level === 'warn') {
    color = ["\033[31m\033[1m", "\033[22m\033[39m"];
  } else if (level === 'success') {
    color = ["\033[35m\033[1m", "\033[22m\033[39m"];
  }
  console.log(brand + color[0] + msg + color[1]);
};
var name = function(name){
  return name
}
// Commander thing
program
  .version(JSON.parse(fs.readFileSync(__dirname + "/../package.json")).version)
  .usage('[options] <name>', name)
  .option('-e, --empty ', 'empty project just the squeleton without git init or files')
  .option('-g, --git', 'Use git for initiliaze project')
  .option('-a, --all', 'Default config setup git project with squeleton and everything')
  .option('-f, --force','Force the operation, deletes dir that already exists')
  .parse(process.argv);

pname = program.args;

var toWrite = [
  {
    name: "index.js",
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date(),
              " * @name: index.js",
              " * @licence: MIT",
              "*/",
              "",
              "",
              "module.exports = require('./lib/"+ pname+"');",
              "module.exports.run(8000);",
              ""].join('\r\n')
  },{
    name: "lib/" + pname + ".js",
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date(),
              " * @name: "+ pname+ ".js",
              " * @licence: MIT",
              "*/",
              "",
              "",
              "var http = require('http');",
              "",
              "var app = http.createServer(function(req,res){",
              "   res.end('I\\'m " + pname +  ", and you');"  ,
              "});",
              "",
              "",
              "function run(port) {",
              "  port = port || 8000;",
              "  app.listen(port, function() {",
              "    console.log('running on port: '+port);",
              "  });",
              "};",
              "module.exports.run = run;",
              ""].join('\r\n')
  },{
    "name":"package.json",
    content: ["{",
              '  "name" : "'+ pname + '",',
              '  "version" : "0.0.1",',
              '  "author" : "Kronos",',
              '  "dependencies": {} ,',
              '  "engines": {">= 0.4.x <' + process.versions.node +'"}',
              '}'].join('\r\n')
  },{
    name: "bin/" + pname,
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date(),
              " * @name: "+ pname,
              " * @licence: MIT",
              "*/",
              "",
              "",
              "module.exports = require('../');",
              ""].join('\r\n')
  },{
    name: "README.md",
    content: ["",
              "# " + pname,
              "",
              " This is a **README**",
              "",
              "## Contributors",
              "",
              "- [Kronos](http://github.com/alejandromg/kronos 'npm install kronos') ",
              ""].join('\r\n')
  }
];

// Initialize `program`
log('');
log('it worked if it ends with ok', 'info');
log('');
log('projects to seed => ' + pname, 'info');

if (program.empty && !program.git){
  // Only squeleton
  log('Empty Project setup', 'info');
  project(true);
} else if (program.git && program.empty || program.git && !program.all) {
  //Squeleton with git config
  log('Empty Project setup with git', 'info');
  project(true,true);
} else if (program.all || program.git || program.args.length !== 0) {
  // default
  log('Setting up new project');
  project(false);
} else if (program.args.length === 0){
  log('No options or invalid options', 'warn');
} else {
  log('I don\'t know what to do', 'warn');
}
