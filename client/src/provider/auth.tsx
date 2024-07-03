import { supabase } from '@/utils/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Context useEffect running");
    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('session onAuthStateChange: ', event, session);
      setSession(session);
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
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
