/*global describe it before*/

"use client";

if (typeof define === "undefined") {
    require("amd-loader");
    require("../../test/setup_paths");
}

define(function(require, exports, module) {
    var assert         = require("ace/test/assertions");
    var LanguageWorker = require('plugins/c9.ide.language/worker').LanguageWorker;
    var EventEmitter   = require("ace/lib/event_emitter").EventEmitter;
    
    describe("JSHint", function(){
        it("test integration base case", function(next) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            emitter.on("markers", function(markers) {
                assert.equal(markers.length, 0);
                next();
            });
            var worker = new LanguageWorker(emitter);
            worker.register("plugins/c9.ide.language.javascript/jshint", null, function() {
                assert.equal(worker.handlers.length, 1);
            });
            worker.switchFile("test.js", false, "javascript", "hello();", null, "");
        });
        
        it("test integration JSHint", function(next) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            emitter.on("markers", function(markers) {
                assert.equal(markers.length, 1);
                assert.equal(markers[0].pos.sl, 1);
                assert.equal(markers[0].message, 'Missing semicolon.');
                next();
            });
            var worker = new LanguageWorker(emitter);
            worker.register("plugins/c9.ide.language.javascript/jshint");
            worker.switchFile("test.js", false, "javascript", "console.log(1);\nhello()", null, "");
        });
        
        it("test JSHint output filtering", function(next) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            emitter.on("markers", function(markers) {
                console.log(markers);
                assert.equal(markers.length, 0);
                next();
            });
            var worker = new LanguageWorker(emitter);
            worker.register("plugins/c9.ide.language.javascript/jshint");
            worker.switchFile("no-errors.js", false, "javascript", "var foo = function() {};\nfoo && foo();", null, "");
        });
        
        it("test JSHint const support", function(next) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            emitter.on("markers", function(markers) {
                console.log(markers);
                assert.equal(markers.length, 0);
                next();
            });
            var worker = new LanguageWorker(emitter);
            worker.register("plugins/c9.ide.language.javascript/jshint");
            worker.switchFile("no-errors.js", false, "javascript", "const foo = 1;", null, "");
        });
        
        it("test JSHint globals", function(next) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            emitter.on("markers", function(markers) {
                console.log(markers);
                assert.equal(markers.length, 0);
                next();
            });
            var worker = new LanguageWorker(emitter);
            worker.register("plugins/c9.ide.language.javascript/jshint");
            worker.switchFile("no-errors.js", false, "javascript", "/*global foo:true*/ foo;", null, "");
        });
    });
    
    onload && onload();
});
