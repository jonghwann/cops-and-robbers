import { router } from 'expo-router';
import Screen from '@/components/layout/screen';
import Title from '@/components/ui/title';

import useProfile from '@/hooks/queries/use-profile';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { data: profile } = useProfile();

  const handleSignOutPress = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Screen>
      <Title
        title={profile?.region3}
        icon={{ name: 'chevron-forward', size: 20 }}
        onPress={() => router.push('/address-search?from=home')}
      />
    </Screen>
  );
}
