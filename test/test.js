var fs = require('fs');
var exec = require('child_process').exec;
var test = require('tap').test;

// folder to create ps
var ps = [ '', 'tmp' ];

for (var i = 0; i < 25; i++) {
    var dir = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    ps.push(dir);
}




test('create and empty project', function (t) {    
    exec(['kronos -e test'], function(err){
        t.ifError(err, 'should not be error');
         fs.stat('./test', function (er, stat) {
            t.ifError(er, 'should exist');
            t.ok(stat && stat.isDirectory(), 'should be directory');
        });
        fs.readdir('./test/', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length, 8, 'should have 8 elements inside')
        });
        fs.readdir('./test/lib', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length,1, 'should have one element inside')
        });
        fs.readdir('./test/bin',function(er,stat){
           t.ifError(er, 'Should be a dir and have files inside');
           t.equal(stat.length, 1, 'should have one element inside')
           exec(['rm -rf test'], function(err){
                t.ifError(err, 'Should erase the test directory')
                t.end();
           })
        });
    });
});

test('create and empty project with git configuration', function (t) {
    exec(['kronos -eg test1'], function(err){
        t.ifError(err, 'should not be error');
         fs.stat('./test1', function (er, stat) {
            t.ifError(er, 'should exist');
            t.ok(stat && stat.isDirectory(), 'should be directory');
        });
        fs.readdir('./test1/', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length, 9, 'should have 8 elements inside')
        });
        fs.readdir('./test1/lib', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length,1, 'should have one element inside')
        });
        fs.readdir('./test1/.git', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length,11, 'should have elements inside')
        });
        fs.readdir('./test1/bin',function(er,stat){
           t.ifError(er, 'Should be a dir and have files inside');
           t.equal(stat.length, 1, 'should have one element inside')
           exec(['rm -rf test1'], function(err){
                t.ifError(err, 'Should erase the test directory')
                t.end();
           })
        });
    });
});
test('create a default project', function (t) {
    exec(['kronos test2'], function(err){
        t.ifError(err, 'should not be error');
         fs.stat('./test2', function (er, stat) {
            t.ifError(er, 'should exist');
            t.ok(stat && stat.isDirectory(), 'should be directory');
        });
        fs.readdir('./test2/', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length, 9, 'should have 8 elements inside')
        });
        fs.readdir('./test2/lib', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length,1, 'should have one element inside')
        });
        fs.readdir('./test2/.git', function(er,stat){
            t.ifError(er, 'should read a dir')
            t.equal(stat.length,11, 'should have elements inside')
        });
        fs.readdir('./test2/bin',function(er,stat){
           t.ifError(er, 'Should be a dir and have files inside');
           t.equal(stat.length, 1, 'should have one element inside')
        });
        fs.readFile('./test2/index.js','utf8', function(err,file){
           t.ifError(err, 'should read index.js');
           t.equal(file.split('\n').length, 13, 'should have 13 lines');
           t.equal(file.length, 202, 'should have 202    chars');
        });
        fs.readFile('./test2/README.md','utf8', function(err,file){
           t.ifError(err, 'should read README.md');
           t.equal(file.split('\n').length, 9, 'should have 9 lines');
           t.equal(file.length, 129, 'should have 129 chars');
        });
        fs.readFile('./test2/package.json','utf8', function(err,file){
           t.ifError(err, 'should read package.json');
           t.equal(file.split('\n').length, 7, 'should have 7 lines');
           t.equal(file.length, 131, 'should have 131 chars');
        });
        fs.readFile('./test2/bin/test2','utf8', function(err,file){
           t.ifError(err, 'should read ./bin/test2');
           t.equal(file.split('\n').length,12, 'should have 12 lines');
           t.equal(file.length, 164, 'should have 164 chars');
        });
        fs.readFile('./test2/lib/test2.js','utf8', function(err,file){
           t.ifError(err, 'should read lib/test2.js');
           t.equal(file.split('\n').length, 25, 'should have 25 lines');
           t.equal(file.length, 418, 'should have 418 chars');
           exec(['rm -rf test2'], function(err){
                t.ifError(err, 'Should erase the test2 directory')
                t.end();
           })
        });
    });

});