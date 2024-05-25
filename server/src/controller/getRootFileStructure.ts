import dirTree from "directory-tree";
import { Request , Response} from "express";
import path from 'path';

export const getRootFileStructure= async (req:Request,res:Response)=>{
    try{
        const cp = path.resolve(__dirname, "../../../user");
        //console.log(cp);
    
        const tree = dirTree(cp);
        return res.json({status:true,msg:tree});
    }catch(err){
        console.log("Error fetching root file structure",err);
        return res.json({status:false,msg:"Error feteching tree structure"})
    }
}