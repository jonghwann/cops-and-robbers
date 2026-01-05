import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { supabase } from '@/utils/supabase';
import './global.css';

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error(error);
          setStatus('error');
        } else {
          setStatus('success');
        }
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="mb-4 font-bold text-2xl">👮🏻‍♂️ Cops and Robbers 💰</Text>

      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-2 text-gray-600">Connecting to Supabase...</Text>
        </>
      )}
      {status === 'success' && <Text className="text-green-600">✅ Supabase Connected!</Text>}
      {status === 'error' && <Text className="text-red-600">❌ Connection Failed</Text>}
    </View>
  );
}
