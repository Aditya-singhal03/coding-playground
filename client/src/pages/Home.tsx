import { useState } from "react"
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

const Home = () => {
  const [template,setTemplate] = useState("");
  const userName = "singhalbspr";
  const spinUpPlayground = async ()=>{
    const {data} = await axios.post("http://localhost:8001/spinUpPlayground",{
      template:template,
      userName:userName,
      playGroundName:template+"4896"
    })
    console.log(data);
  }

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
            <SelectItem value="React">React</SelectItem>
            <SelectItem value="Node">Node</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="m-2">{template && template+"4896"}</p>
      <Button className="m-4" onClick={spinUpPlayground}>Create Playground</Button>
    </div>
  )
}

export default Home