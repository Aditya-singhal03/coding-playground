import { supabase } from "@/utils/supabaseClient"
import { useEffect, useState } from "react"

const SuccessPage = () => {
    const [user,setUser] = useState({})

    useEffect(()=>{
        const getUser = async ()=>{
            const userData = await supabase.auth.getUser()
            console.log(userData)
        }
        const getSession = async()=>{
            const sessionData = await supabase.auth.getSession();
            console.log(sessionData)
        }
        getUser()
        getSession()
    },[])

    return (
        <div>SuccessPage</div>
    )
}

export default SuccessPage