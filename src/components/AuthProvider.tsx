import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, barLicenceNumber?: string, phoneNumber?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, barLicenceNumber?: string, phoneNumber?: string) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      const user = signUpData?.user;

      if (user && (barLicenceNumber || phoneNumber)) {
        const { data: lawyer, error: fetchError } = await supabase
          .from('lawyers')
          .select('id')
          .or(`bar_license_no.eq.${barLicenceNumber},mobile_no.eq.${phoneNumber}`)
          .maybeSingle();


        if (fetchError) throw fetchError;

        if (lawyer) {
          const { error: updateError } = await supabase
            .from('lawyers')
            .update({ user_id: user.id })
            .eq('id', lawyer.id);

          if (updateError) throw updateError;
        }
      }
    } catch (err: any) {
      throw err; // Pass error back to component using the hook
    } finally {
      setLoading(false);
    }

  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};