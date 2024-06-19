import { Request, Response } from "express";
import s3Client from "../utils/s3Client"
import {CopyObjectCommand, HeadObjectCommand, ListBucketsCommand, ListObjectsV2Command} from '@aws-sdk/client-s3'
import dotenv from 'dotenv';
dotenv.config();
const bucketName = process.env.AWS_BUCKET_NAME as string



interface spinUpReqBody{
    template:string,
    userName:string,
    playGroundName:string
}

const existsFolder = async (Bucket: string, Prefix: string) => {
    const command = new ListObjectsV2Command({ Bucket, Prefix, MaxKeys: 1 });

    try {
        const data = await s3Client.send(command);
        console.log(data)
        return data.Contents && data.Contents.length > 0;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
};

const copys3Folder = async(sourcePrefix:string,destinationPrefix:string,continuationToken?: string)=>{
    try{

        const listParams = {
            Bucket: bucketName,
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        const Source = await s3Client.send(
            new ListObjectsV2Command(listParams)
        );
        //console.log(Source)
        if(!Source.Contents || Source.Contents.length==0) return;
    
        await Promise.all(Source.Contents.map((file,idx)=>{
            if(!file.Key) return;
            const params = {
                Bucket: bucketName,
                CopySource: bucketName + '/' + file.Key,
                Key: file.Key.replace(sourcePrefix, destinationPrefix)
            }
            //console.log(params)
            const cm = new CopyObjectCommand(params)
            return s3Client.send(cm,()=>{
                console.log(`Copied ${file.Key} to ${file.Key?.replace(sourcePrefix, destinationPrefix)}`);
            });
        }))

        if (Source.IsTruncated) {
            //listParams.ContinuationToken = Source.NextContinuationToken;
            await copys3Folder(sourcePrefix, destinationPrefix, continuationToken);
        }
    }catch(err){
        console.error('Error copying folder:', err);
    }
}

export const spinPlayground = async (req:Request,res:Response)=>{
    const {template,userName,playGroundName} = req.body;
    if(!template || !playGroundName){
        res.status(400).send("Bad request");
        return;
    }
    //console.log(await existsFolder(bucketName,`code/${userName}/`))
    //console.log(await existsFolder(bucketName,`code/${userName}/${playGroundName}/`))
    if(await existsFolder(bucketName,`code/${userName}/`) && await existsFolder(bucketName,`code/${userName}/${playGroundName}/`)) return res.status(200).send("Project already present");

    await copys3Folder(`templates/${template}` , `code/${userName}/${playGroundName}`);


    
    return res.status(200).send("Project file copied to target place")
}