import { useState } from "react"


const IframeComponent = () => {
    const [cnt,setCnt] = useState(0);
    return (
        <div className="w-full h-full border-none">
            <button onClick={()=>setCnt(cnt+1)}>Refresh</button>
            <iframe key={cnt} src="http://100.0.226.146:1337/" className="w-full h-full border-none"/>
        </div>
    )
}

export default IframeComponent