"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModemSMS = exports.STATUS = void 0;
// import fs from 'fs'
// import util from 'util'
// const exec = util.promisify(child.exec)
var child = __importStar(require("child_process"));
/**
 * Main class
 *
 * @author Carlos Brito <carlosmcp@gmail.com>
 * @since 1.0 <2020-05-22>
 */
var STATUS;
(function (STATUS) {
    STATUS["UNACKNOWLEDGED_ERROR"] = "Error not found";
    STATUS["ERROR_DEVICE_NOT_FOUND"] = "Error opening device";
    STATUS["ERROR_DEVICE_NOT_CONNECTED"] = "Probably the phone is not connected.";
    STATUS["ERROR_CONFIG_NOT_FOUND"] = "Warning: No configuration file found!";
    STATUS["SEND_ERROR"] = "waiting for network answer..error";
    STATUS["SEND_OK"] = "waiting for network answer..OK";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var GatewayModemSMS = /** @class */ (function () {
    function GatewayModemSMS() {
    }
    GatewayModemSMS.prototype.sendMessage = function (phone, message) {
        var command = "gammu sendsms text " + phone + " -text \"" + message + "\" ";
        this.execShellCommand(command)
            .then(this.extractErroMessage);
    };
    /**
   * Encapsulate the shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
    GatewayModemSMS.prototype.execShellCommand = function (cmd) {
        return new Promise(function (resolve, reject) {
            child.exec(cmd, function (error, stdout, stderr) {
                var message = (error || {}).message;
                stdout ? resolve(stdout || stderr) : reject(message); // get the main command's error
            });
        });
    };
    GatewayModemSMS.prototype.extractErroMessage = function (message) {
        return Object.entries(STATUS).find(function (_a) {
            var _ = _a[0], value = _a[1];
            return message.search(value) === 0;
        }) || STATUS.UNACKNOWLEDGED_ERROR;
    };
    return GatewayModemSMS;
}());
exports.GatewayModemSMS = GatewayModemSMS;
//# sourceMappingURL=GatewayModemSMS.js.map