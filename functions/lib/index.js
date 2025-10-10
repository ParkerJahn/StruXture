"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = exports.api = exports.health = void 0;
const functions = __importStar(require("firebase-functions"));
// HTTP function for health check
exports.health = functions.https.onRequest((request, response) => {
    response.json({
        status: 'OK',
        message: 'StruXture Backend is running',
        timestamp: new Date().toISOString(),
        service: 'Firebase Functions'
    });
});
// HTTP function for main API
exports.api = functions.https.onRequest((request, response) => {
    response.json({
        message: 'Welcome to StruXture API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api'
        }
    });
});
// Callable function example
exports.helloWorld = functions.https.onCall((data, context) => {
    return {
        message: `Hello from StruXture! You said: ${data.message || 'nothing'}`,
        timestamp: new Date().toISOString()
    };
});
//# sourceMappingURL=index.js.map