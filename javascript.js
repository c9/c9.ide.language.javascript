/**
 * Cloud9 Language Foundation
 *
 * @copyright 2013, Ajax.org B.V.
 */
define(function(require, exports, module) {
    main.consumes = ["Plugin", "language", "preferences", "settings"];
    main.provides = ["language.javascript"];
    return main;

    function main(options, imports, register) {
        var language = imports.language;
        var settings = imports.settings;
        var Plugin = imports.Plugin;
        var plugin = new Plugin("Ajax.org", main.consumes);
        var prefs = imports.preferences;
        
        plugin.on("load", function() {
            prefs.add({
                "Project": {
                    "Language Support": {
                        position: 710,
                        "JavaScript": {
                            position: 200,
                            type: "label",
                            caption: "JavaScript:",
                        },
                        "Format Code on Save": {
                            position: 210,
                            type: "checkbox",
                            path: "project/format/@javascript_enabled",
                        },
                        "Custom Code Formatter": {
                            position: 220,
                            type: "textbox",
                            path: "project/format/@javascript_formatter",
                        }
                    }
                }
            }, plugin);
            
            settings.on("read", function() {
                settings.setDefaults("project/format", [
                    ["javascript_enabled", "false"],
                    ["javascript_formatter", "eslint_d --fix $file || eslint --fix $file"],
                ]);
            });

            language.registerLanguageHandler('plugins/c9.ide.language.javascript/parse');
            language.registerLanguageHandler('plugins/c9.ide.language.javascript/scope_analyzer');
            
            language.registerLanguageHandler('plugins/c9.ide.language.javascript/debugger');
            language.registerLanguageHandler('plugins/c9.ide.language.javascript/outline');
            language.registerLanguageHandler('plugins/c9.ide.language.javascript/jumptodef');
        });
        plugin.on("unload", function() {
            
        });
        
        register(null, {
            "language.javascript": plugin
        });
    }
});