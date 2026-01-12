import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import useSetMeetingFavorite from '@/hooks/mutations/use-set-meeting-favorite';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import Icon from '../ui/icon';

export default function MeetingListItem({ id }: { id: string }) {
  const { data: meeting } = useMeetingById(id, 'list');
  const { mutate: setMeetingFavorite } = useSetMeetingFavorite();

  if (!meeting) return null;

  const {
    id: meetingId,
    title,
    description,
    thumbnailUrl,
    region2,
    memberCount,
    isFavorite,
  } = meeting;

  return (
    <Link href={`/meetings/${meetingId}`} asChild>
      <Pressable className="flex-row gap-4 active:bg-gray-100">
        <View className="relative">
          <Image source={{ uri: thumbnailUrl }} className="h-24 w-24 rounded-xl" />

          <Pressable
            onPress={() => setMeetingFavorite({ meetingId: meetingId, isFavorite: !isFavorite })}
            className="absolute bottom-1 left-1"
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? 'red' : 'white'}
            />
          </Pressable>
        </View>

        <View className="flex-1 justify-center">
          <Text numberOfLines={1} className="font-bold text-2xl">
            {title}
          </Text>

          <Text numberOfLines={1} className="text-xl">
            {description}
          </Text>

          <Text className="text-gray-400">
            {region2} · {memberCount}명
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
