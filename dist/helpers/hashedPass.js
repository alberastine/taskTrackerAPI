"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            else {
                bcryptjs_1.default.hash(password, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
