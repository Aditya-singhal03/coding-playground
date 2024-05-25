"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootFileStructure = void 0;
const directory_tree_1 = __importDefault(require("directory-tree"));
const path_1 = __importDefault(require("path"));
const getRootFileStructure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cp = path_1.default.resolve(__dirname, "../../../user");
        //console.log(cp);
        const tree = (0, directory_tree_1.default)(cp);
        return res.json({ status: true, msg: tree });
    }
    catch (err) {
        console.log("Error fetching root file structure", err);
        return res.json({ status: false, msg: "Error feteching tree structure" });
    }
});
exports.getRootFileStructure = getRootFileStructure;
