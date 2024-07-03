import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/utils/supabaseClient'
import { useAuth } from '@/provider/auth'
import {  useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AuthPage = () => {
    const navigate = useNavigate()

    // useEffect(() => {
    //     const { data: {subscription} } = supabase.auth.onAuthStateChange(async (event,session) => {
    //         console.log(event , session)
    //         if (event === "SIGNED_IN") {
    //             navigate("/success")
    //         }
    //     })

    //     return () => {
    //         subscription?.unsubscribe()
    //     }
    // }, [navigate])
    const {user} = useAuth();
    useEffect(()=>{
        if(user) navigate("/")
    },[user])

    return (
        <>
            <div className='h-screen flex items-center justify-center'>
                <header className='w-96'>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme='dark'
                        providers={['google']}
                        redirectTo='http://localhost:5173/'
                        />
                </header>
            </div>

            <button onClick={()=>{
                navigate("/")
            }}>home</button>
        </>
    )
}

export default AuthPage
