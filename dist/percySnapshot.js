"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.command = void 0;
var fs = require("fs");
var environment_1 = require("./environment");
var _a = require('@percy/agent/dist/utils/sdk-utils'), agentJsFilename = _a.agentJsFilename, isAgentRunning = _a.isAgentRunning, postSnapshot = _a.postSnapshot;
/**
 * A custom Nightwatch command to take a Percy snapshot. To install in your Nightwatch tests,
 * add the path to this module to the 'custom_commands_path' array in your Nightwatch configuration. See
 * documentation for 'path' on this module for an example of how to do that.
 *
 * Once installed, the command will be available as 'percySnapshot(...)'.
 *
 * @param name Name of the snapshot that we're taking. If omitted, will use the name of the current test.
 * @param options Additional options, e.g. '{widths: [768, 992, 1200]}'. Optional.
 */
function command(name, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    name = name || this.currentTest.name;
    this.execute(fs.readFileSync(agentJsFilename()).toString());
    return isAgentRunning().then(function (canSnapshot) {
        if (!canSnapshot) {
            return;
        }
        return _this.execute(function (name, options, clientInfo) {
            var percyAgentClient = new PercyAgent({ clientInfo: clientInfo, handleAgentCommunication: false });
            return {
                dom: percyAgentClient.snapshot(name, options),
                url: window.location.href
            };
        }, [name, options, environment_1.clientInfo()], function (browserReturn) {
            return postSnapshot(__assign({ name: name, url: browserReturn.value.url, domSnapshot: browserReturn.value.dom, clientInfo: environment_1.clientInfo() }, options));
        });
    });
}
exports.command = command;
/**
 * Path to this module's directory. Add to the 'custom_commands_path' array in your
 * Nightwatch configuration:
 *
 * const percy = require('@percy/nightwatch')
 *
 * module.exports = {
 *   [...your nightwatch configuration...]
 *   custom_commands_path: [ percy.path ],
 * }
 */
exports.path = __dirname;
