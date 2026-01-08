import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSetAddress } from '@/store/address';
import type { Address } from '@/types/address';

interface AddressListItemProps extends Address {}

export default function AddressListItem({
  region1,
  region2,
  region3,
  hCode,
}: AddressListItemProps) {
  const setAddress = useSetAddress();

  const handlePress = () => {
    setAddress({ region1, region2, region3, hCode });
    router.back();
  };

  return (
    <Pressable onPress={handlePress} className="active:bg-gray-100">
      <View className="flex-row items-center gap-2 border-gray-100 border-b px-2 py-5">
        <Text className="text-xl">{region3}</Text>
        <Text className="text-base text-gray-300">
          ({region1} {region2})
        </Text>
      </View>
    </Pressable>
  );
}
