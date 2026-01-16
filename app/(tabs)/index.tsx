import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, View } from 'react-native';
import Screen from '@/components/layout/screen';
import CreateMeetingFab from '@/components/meetings/create-meeting-fab';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';
import Title from '@/components/ui/title';
import useMeetings from '@/hooks/queries/use-meetings';
import useProfile from '@/hooks/queries/use-profile';
import { queryKeys } from '@/lib/query-keys';

export default function Index() {
  const queryClient = useQueryClient();

  const { data: profile } = useProfile();
  const {
    data: meetings,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useMeetings(profile?.region2 ?? '');

  const meetingIds = meetings?.pages.flatMap((page) => page.ids) ?? [];

  const onRefresh = () => {
    queryClient.removeQueries({
      queryKey: queryKeys.meetings.list(profile?.region2 ?? ''),
      exact: true,
    });
    refetch();
  };

  return (
    <Screen>
      <Title
        title={profile?.region3 ?? ''}
        icon={{ name: 'chevron-forward', size: 20 }}
        onPress={() => router.push('/(screen)/address-search?from=home')}
      />

      <FlatList
        data={meetingIds}
        keyExtractor={(id) => id}
        renderItem={({ item }) => <MeetingListItem id={item} />}
        contentContainerClassName="gap-4"
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />

      {meetingIds.length === 0 && isRefetching && (
        <Result
          figure={<Icon name="information-circle-outline" size={100} />}
          title="표시할 모임이 없어요"
          description="지역을 바꾸거나 새 모임을 만들어보세요"
        />
      )}

      <CreateMeetingFab />
    </Screen>
  );
}
