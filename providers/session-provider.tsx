import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function SessionProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(queryKeys.profile.all, null);
        router.replace('/(auth)');
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  return <>{children}</>;
}
