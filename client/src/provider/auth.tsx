import { supabase } from '@/utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading:boolean
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading:true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    console.log("Context useEffect running");
    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('session onAuthStateChange: ', event, session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    console.log(data, error);
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("logout ->", error);
    return error;
  }

  return (
    <AuthContext.Provider value={{ user , loading , login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
