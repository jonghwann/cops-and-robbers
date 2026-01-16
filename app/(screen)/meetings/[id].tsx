import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingsBadge from '@/components/meetings/meetings-badge';
import Border from '@/components/ui/border';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BACK_SCREEN_OPTIONS } from '@/constants/screens';
import useDeleteMeeting from '@/hooks/mutations/use-delete-meeting';
import useJoinMeeting from '@/hooks/mutations/use-join-meeting';
import useSetMeetingFavorite from '@/hooks/mutations/use-set-meeting-favorite';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import useMeetingMembers from '@/hooks/queries/use-meeting-members';
import useProfile from '@/hooks/queries/use-profile';
import { useRecentMeetingsActions } from '@/hooks/queries/use-recent-meeting';
import { toast } from '@/utils/toast';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: profile } = useProfile();
  const { data: meeting } = useMeetingById(id, 'detail');
  const { add } = useRecentMeetingsActions();
  const { mutate: toggleFavorite } = useSetMeetingFavorite();
  const { data: members } = useMeetingMembers(id);
  const { mutate: joinMeeting, isPending: isPendingJoinMeeting } = useJoinMeeting(id, {
    onError: () => toast.error('모임 참여에 실패했습니다'),
  });
  const { mutate: deleteMeeting } = useDeleteMeeting(id, {
    onSuccess: () => router.back(),
    onError: () => toast.error('모임 삭제에 실패했습니다'),
  });

  useEffect(() => {
    add(id);
  }, [add, id]);

  if (!meeting) return null;

  const { hostId, title, description, thumbnailUrl, isFavorite, region2, memberCount, isJoined } =
    meeting;

  const isHost = hostId === profile?.id;

  const onPressMore = () => {
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
  };

  console.log(isHost);

  return (
    <Screen edges={['left', 'right']} hasHeader className="px-0">
      <ScrollView className="px-5">
        <Stack.Screen
          options={{
            ...BACK_SCREEN_OPTIONS,
            title,
            headerRight: () => (
              <View className="flex-row gap-6 px-2">
                <Icon
                  name="heart"
                  size={24}
                  color={isFavorite ? 'red' : '#e5e7eb'}
                  onPress={() => toggleFavorite({ meetingId: meeting.id, isFavorite: !isFavorite })}
                />
                {isHost && (
                  <Icon name="ellipsis-horizontal" size={24} color="black" onPress={onPressMore} />
                )}
              </View>
            ),
          }}
        />
        <Image source={{ uri: thumbnailUrl }} className="mb-4 aspect-[20/9] w-full rounded-lg" />

        <View className="mb-3 flex-row gap-2">
          <MeetingsBadge title={region2} />
          <MeetingsBadge title={`멤버 ${memberCount}명`} />
        </View>

        <Text className="mb-6 font-bold text-2xl">{title}</Text>
        <Text className="text-xl">{description}</Text>

        <Border className="mt-10 mb-6" />

        <Text className="mb-6 font-bold text-2xl">일정</Text>

        <Border className="my-6" />

        <Text className="mb-6 font-bold text-2xl">멤버 ({members?.length ?? 0})</Text>

        {members?.map((member) => (
          <View key={member.userId} className="flex-row items-center gap-3">
            {member.avatarUrl ? (
              <Image source={{ uri: member.avatarUrl }} className="size-12 rounded-full" />
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
            isLoading={isPendingJoinMeeting}
            onPress={() => joinMeeting(id)}
            className="h-16 flex-1 rounded-none rounded-r-lg"
          />
        </View>
      )}
    </Screen>
  );
}
