import { router } from 'expo-router';
import { ActivityIndicator, FlatList, View } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Title from '@/components/ui/title';
import useMeetings from '@/hooks/queries/use-meetings';
import useProfile from '@/hooks/queries/use-profile';

export default function Index() {
  const { data: profile } = useProfile();
  const {
    data: meetings,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMeetings(profile?.region2 ?? '');

  const meetingIds = meetings?.pages.flatMap((page) => page.ids) ?? [];

  return (
    <Screen>
      <Title
        title={profile?.region3 ?? ''}
        icon={{ name: 'chevron-forward', size: 20 }}
        onPress={() => router.push('/address-search?from=home')}
      />

      <FlatList
        data={meetingIds}
        keyExtractor={(id) => id}
        renderItem={({ item }) => <MeetingListItem id={item} />}
        contentContainerClassName="gap-4"
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </Screen>
  );
}
