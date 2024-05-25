import dirTree from "directory-tree";
import path from 'path';

const cp = path.resolve(__dirname, "../");
console.log(cp);

const tree = dirTree(cp);
console.log(tree.children);