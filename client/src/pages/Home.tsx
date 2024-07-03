import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate  = useNavigate()
  const [template,setTemplate] = useState("");
  const [isContainerReady , setIsContainerReady] = useState(false);
  const userName = "hitesh122";


  const spinUpPlayground = async ()=>{
    try{
      const {data} = await axios.post("http://localhost:8001/spinUpPlayground",{
        template:"Node",
        userName:userName,
        playGroundName:template+"4896"
      })
      console.log(data);
      //orchestrator invoke
      const ans = await axios.post("http://localhost:8002/start",{
        projectName:template+"4896",
        userName:userName
      });
      console.log(ans);
      setIsContainerReady(true)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(isContainerReady) navigate("/playground");
  },[isContainerReady])

  return (
    <div className="p-4 flex justify-center items-center">
      <Select 
        onValueChange={(value)=>setTemplate(value)}
        defaultValue={template}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a playground"  onChange={(val)=>console.log(val)}/>
        </SelectTrigger>
        <SelectContent >
          <SelectGroup>
            <SelectLabel>Templates</SelectLabel>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="node">Node</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="m-2">{template && template+"4896"}</p>
      <Button className="m-4" onClick={spinUpPlayground}>Create Playground</Button>
    </div>
  )
}

export default Home