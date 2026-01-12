import { router } from 'expo-router';
import { FlatList } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Title from '@/components/ui/title';
import useMeetings from '@/hooks/queries/use-meetings';
import useProfile from '@/hooks/queries/use-profile';

export default function Index() {
  const { data: profile } = useProfile();
  const { data: meetings } = useMeetings();

  return (
    <Screen>
      <Title
        title={profile?.region3 ?? ''}
        icon={{ name: 'chevron-forward', size: 20 }}
        onPress={() => router.push('/address-search?from=home')}
      />

      <FlatList
        data={meetings}
        renderItem={({ item }) => <MeetingListItem id={item} />}
        contentContainerClassName="gap-4"
      />
    </Screen>
  );
}
