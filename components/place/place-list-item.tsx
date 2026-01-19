import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { Place } from '@/api/kakao/type';
import { useSetPlace } from '@/store/place';

export default function PlaceListItem(place: Place) {
  const setPlace = useSetPlace();

  const handlePress = () => {
    setPlace(place);
    router.back();
  };

  return (
    <Pressable onPress={handlePress} className="active:bg-gray-100">
      <View className="border-gray-100 border-b px-2 py-5">
        <Text className="text-xl">{place.name}</Text>
        <Text className="text-base text-gray-400">{place.address}</Text>
      </View>
    </Pressable>
  );
}
