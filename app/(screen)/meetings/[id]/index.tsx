import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingsBadge from '@/components/meetings/meetings-badge';
import ScheduleListItem from '@/components/schedule/schedule-list-item';
import Border from '@/components/ui/border';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BACK_SCREEN_OPTIONS } from '@/constants/screens';
import useDeleteMeeting from '@/hooks/mutations/use-delete-meeting';
import useJoinMeeting from '@/hooks/mutations/use-join-meeting';
import useLeaveMeeting from '@/hooks/mutations/use-leave-meeting';
import useSetMeetingFavorite from '@/hooks/mutations/use-set-meeting-favorite';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import useMeetingMembers from '@/hooks/queries/use-meeting-members';
import useMeetingSchedules from '@/hooks/queries/use-meeting-schedules';
import useProfile from '@/hooks/queries/use-profile';
import { useRecentMeetingsActions } from '@/hooks/queries/use-recent-meeting';
import { cn } from '@/lib/cn';
import { toast } from '@/utils/toast';

export default function Index() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const { data: profile } = useProfile();
  const { data: meeting, refetch: refetchMeeting } = useMeetingById(id, 'detail');
  const { add } = useRecentMeetingsActions();
  const { mutate: toggleFavorite } = useSetMeetingFavorite();
  const { data: schedules, refetch: refetchMeetingSchedules } = useMeetingSchedules(id);
  const { data: members, refetch: refetchMeetingMembers } = useMeetingMembers(id);

  const { mutate: joinMeeting, isPending: isJoiningMeetingPending } = useJoinMeeting(id, {
    onError: () => {
      toast.error('모임 참여에 실패했습니다');
    },
  });

  const { mutate: deleteMeeting } = useDeleteMeeting(id, {
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error('모임 삭제에 실패했습니다');
    },
  });

  const { mutate: leaveMeeting } = useLeaveMeeting(id, {
    onError: () => {
      toast.error('모임 탈퇴에 실패했습니다');
    },
  });

  const onRefresh = async () => {
    setIsPullRefreshing(true);
    try {
      await Promise.all([refetchMeeting(), refetchMeetingMembers(), refetchMeetingSchedules()]);
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handleMorePress = () => {
    if (isHost) {
      Alert.alert('', undefined, [
        { text: '모임 수정하기', onPress: () => router.push(`/meetings/edit/${id}`) },
        {
          text: '모임 삭제하기',
          style: 'destructive',
          onPress: () => {
            Alert.alert('정말 삭제하시겠어요?', '삭제하면 되돌릴 수 없어요', [
              { text: '삭제', style: 'destructive', onPress: () => deleteMeeting(id) },
              { text: '취소', style: 'cancel' },
            ]);
          },
        },
        { text: '취소', style: 'cancel' },
      ]);
      return;
    }

    Alert.alert('', undefined, [
      {
        text: '모임 탈퇴하기',
        style: 'destructive',
        onPress: () => {
          leaveMeeting(id);
        },
      },
      { text: '취소', style: 'cancel' },
    ]);
  };

  useEffect(() => {
    add(id);
  }, [add, id]);

  if (!meeting) return null;

  const { hostId, title, description, thumbnailUrl, isFavorite, region2, memberCount, isJoined } =
    meeting;
  const isHost = hostId === profile?.id;

  return (
    <Screen edges={['left', 'right']} hasHeader className="px-0">
      <ScrollView
        className="px-5"
        refreshControl={<RefreshControl refreshing={isPullRefreshing} onRefresh={onRefresh} />}
      >
        <Stack.Screen
          options={{
            ...BACK_SCREEN_OPTIONS,
            title,
            headerRight: () => (
              <View className="flex-row gap-6 px-2">
                {isJoined && (
                  <Icon
                    name="chatbubble-ellipses"
                    size={24}
                    color="black"
                    onPress={() => router.push(`/meetings/${id}/chat`)}
                  />
                )}
                <Icon
                  name="heart"
                  size={24}
                  color={isFavorite ? 'red' : '#e5e7eb'}
                  onPress={() => toggleFavorite({ meetingId: meeting.id, isFavorite: !isFavorite })}
                />
                {isJoined && (
                  <Icon
                    name="ellipsis-horizontal"
                    size={24}
                    color="black"
                    onPress={handleMorePress}
                  />
                )}
              </View>
            ),
          }}
        />

        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: '100%', aspectRatio: 20 / 9, borderRadius: 12, marginBottom: 16 }}
        />

        <View className="mb-3 flex-row gap-2">
          <MeetingsBadge title={region2} />
          <MeetingsBadge title={`멤버 ${memberCount}명`} />
        </View>

        <Text className="mb-6 font-bold text-2xl">{title}</Text>
        <Text className="text-xl">{description}</Text>

        <Border className="mt-10 mb-6" />

        {/* 일정 목록 */}
        <Text className="mb-6 font-bold text-2xl">일정</Text>

        {schedules && schedules.length === 0 ? (
          <View>
            <Text className="font-bold text-xl">아직 일정이 없어요!</Text>
            {isHost && <Text className="mb-5 text-gray-400 text-xl">일정을 만들어보세요.</Text>}
          </View>
        ) : (
          <View className="gap-6">
            {schedules?.map((schedule) => (
              <View key={schedule.id}>
                <ScheduleListItem
                  schedule={schedule}
                  onPress={
                    isHost
                      ? () => router.push(`/meetings/${id}/schedule/${schedule.id}/edit`)
                      : undefined
                  }
                />
              </View>
            ))}
          </View>
        )}

        {isHost && (
          <Button
            title="일정 만들기"
            onPress={() => router.push(`/meetings/${id}/schedule/create`)}
            className={cn(schedules && schedules.length === 0 ? '' : 'mt-10')}
          />
        )}

        <Border className="my-6" />

        {/* 멤버 목록 */}
        <Text className="mb-6 font-bold text-2xl">멤버 ({members?.length ?? 0})</Text>

        <View className="gap-4">
          {members?.map((member) => (
            <View key={member.userId} className="flex-row items-center gap-3">
              {member.avatarUrl ? (
                <View className="size-12 overflow-hidden rounded-full">
                  <Image source={{ uri: member.avatarUrl }} style={{ width: 48, height: 48 }} />
                </View>
              ) : (
                <View className="relative size-12 rounded-full bg-gray-200">
                  <Icon
                    name="person"
                    size={24}
                    color="gray"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </View>
              )}

              <Text className="font-bold text-xl">{member.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {!isJoined && (
        <View className="absolute right-5 bottom-14 left-5 flex-row shadow-md">
          <Pressable
            onPress={() => toggleFavorite({ meetingId: meeting.id, isFavorite: !isFavorite })}
            className="size-16 items-center justify-center rounded-l-lg bg-white"
          >
            <Icon name={'heart'} size={24} color={isFavorite ? 'red' : '#e5e7eb'} />
          </Pressable>

          <Button
            title={'참여하기'}
            isLoading={isJoiningMeetingPending}
            onPress={() => joinMeeting(id)}
            className="h-16 flex-1 rounded-none rounded-r-lg"
          />
        </View>
      )}
    </Screen>
  );
}
