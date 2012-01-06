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



function name (name){
  this.name = name
  console.log(this.name)
  return this
}
function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}
var createDirs = function(names){
  names.forEach(function(name){
    try {
      mkdirp.sync('./' + name + '/lib',0755)
      log('created ' + './' + name + '/lib','info');
      mkdirp.sync('./' + name + '/bin',0755)
      log('created ' + './' + name + '/bin','info');
      mkdirp.sync('./' + name + '/test',0755)
      log('created ' + './' + name + '/test','info');
      mkdirp.sync('./' + name + '/examples',0755)
      log('created ' + './' + name + '/examples','info');
    }  catch(excp) {
      log(excp);
      log('Not OK','warn');
      process.stdin.destroy();
    }
  })
}
var touchFiles = function(names,ss){
  ss = arguments.length === 2? true:false;
  names.forEach(function(name){
    try {
      exec([
        "touch ./"+ name + "/index.js &&",
        "touch ./"+ name + "/package.json &&",
        "touch ./"+ name + "/README.md &&",
        "touch ./"+ name + "/History.md &&",
        "touch ./"+ name + "/lib/"+ name + ".js &&",
        "touch ./"+ name + "/bin/"+ name,
        ].join(''), function(err,data){
          if (err) {
            log(err,'warn')
            log('Not OK','warn')
            process.stdin.destroy();
          } else{
            log("created ./"+ name + "/index.js","info");
            log("created ./"+ name + "/package.json ","info");
            log("created ./"+ name + "/README.md ","info");
            log("created ./"+ name + "/History.md","info");
            log("created ./"+ name + "/lib/"+ name + ".js ","info");
            log("created ./"+ name + "/bin/"+ name,"info");
          }
           if (ss && (names.length -1)=== names.indexOf(name)) {
            log('Ok','success');
          }
        })
    } catch(excp){
       log(excp,'warn')
      log('Not OK','warn')
      process.stdin.destroy();
    }
  })
}
var git = function(names,ss){
  names.forEach(function(name){
    try {
      exec([
        "cd " + process.env.PWD + "/" + name,
        "&& git init ",
        "&& git add . ",
        "&& git commit -am 'Initial Commit'"
        ].join(''), function(err,data){
          if (err){
            log(err,'warn')
            log('Not OK','warn')
            process.stdin.destroy();
          } else {
            log('initialized repo dir ' + name , info)
          }
        })
    } catch(excp){
      log(excp,'warn')
      log('Not OK','warn')
      process.stdin.destroy();
    }
    if ( ss && (names.length -1)=== names.indexOf(name)) {
      log('Ok','success');
    }
  });
}
var echo = function(names){
  names.forEach(function(name){
    toWrite.forEach(function(file){
      write(process.env.PWD + '/' + name + '/' + file.name, file.content )
    });
  })
}
var project = function(empty,git) {
  if (pname.length === 0) {
    log('Invalid project name','warn');
    log('Not OK','warn');
    process.stdin.destroy();
  } else {
     // setup dir
    createDirs(pname);
    if (empty){
      touchFiles(pname,true);
    } else if (empty && git) {
      touchFiles(pname);
      git(pname,true);
    } else {
      touchFiles(pname)
      echo(pname);
      git(pname,true);
    }
  }
}
var log = function(msg, level){
  var color=['','']
  var brand= '\033[90m' + '[kronos]   : ' + '\033[39m';
  if (level === 'info') {
    color=['\033[36m', '\033[39m'];
  } else if(level === 'warn') {
    color = ['\033[31m\033[1m', '\033[22m\033[39m'];
  } else if (level === 'success') {
    color = ['\033[35m\033[1m', '\033[22m\033[39m'];
  }
  var brand= '\033[90m' + '[kronos]   : ' + '\033[39m';
  console.log(brand + color[0] + msg + color[1]);
}

log('')
log('it worked if it ends with ok', 'info')
log('')
program
  .version('0.0.1')
  .usage('[options] <name>', name)
  .option('-e, --empty ', 'empty project just the squeleton without git init or files')
  .option('-g, --git', 'Use git for initiliaze project')
  .option('-f, --full', 'Default config setup git project with squeleton and everything')
  .parse(process.argv);

pname = program.args;
var toWrite = [
  {
    name: "index.js",
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date,
              " * @name: index.js",
              " * @licence: MIT",
              "*/",
              "",
              "",
              "module.exports = require('./lib/"+ pname+"');",
              ""].join('\r\n'),
  },
  {
    name: "lib/" + pname + ".js",
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date,
              " * @name: "+ pname+ ".js",
              " * @licence: MIT",
              "*/",
              "",
              "",
              "module.exports = require('./lib/"+ pname+"');",
              ""].join('\r\n')
  },{
    "name":"package.json",
    content: ["{",
              '  "name" : "'+ pname + '",',
              '  "version" : "0.0.1",',
              '  "author" : "Kronos",',
              '  "dependencies": {} ,',
              '  "engines": {>= 0.4.x <' + process.versions.node +'}',
              '}'].join('\r\n')
  },{
    name: "bin/" + pname,
    content: ["#!/usr/bin/env node",
              "",
              "/*" ,
              " * " + pname,
              " * @date:" + new Date,
              " * @name: "+ pname,
              " * @licence: MIT",
              "*/",
              "",
              "",
              "module.exports = require('../');",
              ""].join('\r\n')
  }]
log('projects to seed => ' + pname, 'info')
if (program.empty){
  // Only squeleton
log('Empty Project setup', 'info')
project(true);
} else if (program.git && program.empty || program.git && !program.full) {
  //Squeleton with git config
  log('Empty Project setup with git', 'info')
  project(true,true);
} else if (program.full || program.git || program.args.length !== 0) {
  // default
  log('Setting up new project')
  project(false);
} else if (program.args.length === 0){
  log('No options or invalid options', 'warn')
}

