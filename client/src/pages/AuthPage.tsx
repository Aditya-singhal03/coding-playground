import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
//import { useNavigate } from 'react-router-dom'
import { supabase } from '@/utils/supabaseClient'
//import { useEffect } from 'react'

const AuthPage = () => {
    // const navigate = useNavigate()

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

    return (
        <div className='h-screen flex items-center justify-center'>
            <header className='w-96'>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme='dark'
                    providers={['google']}
                />
            </header>
        </div>
    )
}

export default AuthPage
