import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BACK_SCREEN_OPTIONS } from '@/constants/screens';
import useSetMeetingFavorite from '@/hooks/mutations/use-set-meeting-favorite';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';

export default function MeetingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: meeting } = useMeetingById(id, 'detail');
  const { mutate: toggleFavorite } = useSetMeetingFavorite();

  if (!meeting) return null;

  const { title, thumbnailUrl, isFavorite } = meeting;

  return (
    <Screen hasHeader className="relative">
      <Stack.Screen options={{ ...BACK_SCREEN_OPTIONS, title }} />
      <Image source={{ uri: thumbnailUrl }} className="aspect-video rounded-2xl" />

      <View className="absolute bottom-10 flex-row">
        <Pressable
          onPress={() => toggleFavorite({ meetingId: meeting.id, isFavorite: !isFavorite })}
          className="w-10 items-center justify-center bg-gray-200"
        >
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? 'red' : 'white'}
          />
        </Pressable>

        <Button title="참여하기" onPress={() => {}} />
      </View>
    </Screen>
  );
}
