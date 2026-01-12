import { Image, Text, View } from 'react-native';
import type { Meeting } from '@/types/meeting';

export default function MeetingListItem({
  title,
  description,
  thumbnailUrl,
  region2,
  memberCount,
}: Meeting) {
  return (
    <View className="flex-row gap-4">
      <Image source={{ uri: thumbnailUrl }} className="h-24 w-24 rounded-xl" />

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
    </View>
  );
}
