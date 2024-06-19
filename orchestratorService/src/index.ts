import express, { Request, Response } from 'express';
import cors from 'cors';
import {KubeConfig, AppsV1Api, CoreV1Api , NetworkingV1Api} from "@kubernetes/client-node"
import YAML from 'yaml'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req:Request,res:Response)=>{
    res.send("Orch running brrrr")
})

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

const readAndParseKubeYaml = (yamlPath:string,projectName:string,userName:string)=>{
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    const docs =  YAML.parseAllDocuments(fileContent).map((doc)=>{
        let docString = doc.toString();
        const regex = new RegExp(`service_name`, 'g');
        docString = docString.replace(regex, projectName);
        const regexUser = new RegExp(`user_name`, 'g');
        docString = docString.replace(regexUser, userName);
        const regexAwsAccessKeyId = new RegExp(`your_aws_key_id`, 'g');
        docString = docString.replace(regexAwsAccessKeyId, process.env.AWS_ACCESS_KEY_ID as string);
        const regexAwsSecretAccessKey = new RegExp(`your_aws_secret`, 'g');
        docString = docString.replace(regexAwsSecretAccessKey, process.env.AWS_SECRET_ACCESS_KEY as string);

        console.log(docString);
        return YAML.parse(docString);
    })
    return docs;
}


app.post("/start",async (req:Request,res:Response)=>{
    const {projectName,userName}:{projectName:string,userName:string} = req.body;
    const namespace = "default"

    try{
        const yamlPath = path.join(__dirname,"../service.yaml");
        const kubeManifests = readAndParseKubeYaml(yamlPath,projectName,userName);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    await appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    await coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    await networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        res.status(200).send({ message: "Resources created successfully" });
    }catch(error){
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
})

app.listen(8002,()=>{
    console.log("Orchestrator running on 8002");
})