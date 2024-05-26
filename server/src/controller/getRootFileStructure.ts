import dirTree from "directory-tree";
import { Request, Response } from "express";
import path from 'path';

export const getRootFileStructure = async (req: Request, res: Response) => {
  try {
    const cp = path.resolve(__dirname, "../../../user");
    const nodeModulePath = path.resolve(cp, "./node_modules");

    // Use a RegExp to exclude the node_modules directory
    const tree = dirTree(cp, { exclude: [new RegExp(nodeModulePath)] });

    return res.json({ status: true, msg: tree });
  } catch (err) {
    console.log("Error fetching root file structure", err);
    return res.json({ status: false, msg: "Error fetching tree structure" });
  }
}
