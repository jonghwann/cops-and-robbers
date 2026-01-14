import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingsBadge from '@/components/meetings/meetings-badge';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BACK_SCREEN_OPTIONS } from '@/constants/screens';
import useJoinMeeting from '@/hooks/mutations/use-join-meeting';
import useSetMeetingFavorite from '@/hooks/mutations/use-set-meeting-favorite';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import { toast } from '@/utils/toast';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: meeting } = useMeetingById(id, 'detail');
  const { mutate: toggleFavorite } = useSetMeetingFavorite();
  const { mutate: joinMeeting, isPending: isPendingJoinMeeting } = useJoinMeeting(id, {
    onSuccess: () => {
      toast.success('모임에 참여했습니다');
    },
    onError: () => {
      toast.error('모임 참여에 실패했습니다');
    },
  });

  if (!meeting) return null;

  const { title, description, thumbnailUrl, isFavorite, region2, memberCount, isJoined } = meeting;

  return (
    <Screen hasHeader>
      <ScrollView showsVerticalScrollIndicator={false} className="mb-16">
        <Stack.Screen options={{ ...BACK_SCREEN_OPTIONS, title }} />

        <Image source={{ uri: thumbnailUrl }} className="mb-4 aspect-[20/9] w-full rounded-lg" />

        <View className="mb-3 flex-row gap-2">
          <MeetingsBadge title={region2} />
          <MeetingsBadge title={`멤버 ${memberCount}명`} />
        </View>

        <Text className="mb-6 font-bold text-3xl">{title}</Text>
        <Text className="text-2xl">{description}</Text>
      </ScrollView>

      <View className="absolute right-5 bottom-14 left-5 flex-row shadow-md">
        <Pressable
          onPress={() => toggleFavorite({ meetingId: meeting.id, isFavorite: !isFavorite })}
          className="size-16 items-center justify-center rounded-l-lg bg-white"
        >
          <Icon name={'heart'} size={24} color={isFavorite ? 'red' : '#e5e7eb'} />
        </Pressable>

        <Button
          title={isJoined ? '참여중' : '참여하기'}
          disabled={isJoined}
          isLoading={isPendingJoinMeeting}
          onPress={() => joinMeeting(id)}
          className="h-16 flex-1 rounded-none rounded-r-lg"
        />
      </View>
    </Screen>
  );
}
