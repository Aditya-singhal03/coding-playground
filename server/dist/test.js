"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const directory_tree_1 = __importDefault(require("directory-tree"));
const path_1 = __importDefault(require("path"));
const cp = path_1.default.resolve(__dirname, "../");
console.log(cp);
const tree = (0, directory_tree_1.default)(cp);
console.log(tree.children);
