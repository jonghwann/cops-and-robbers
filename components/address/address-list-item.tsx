import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSetAddress } from '@/store/address';

interface AddressListItemProps {
  region1: string;
  region2: string;
  region3: string;
  hCode: string;
}

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
    <Pressable onPress={handlePress} className="active:bg-[#f3f4f6]">
      <View className="flex-row items-center gap-2 border-[#f3f4f6] border-b px-2 py-5">
        <Text className="text-2xl">{region3}</Text>
        <Text className="text-[#a0a0a0] text-xl">
          ({region1} {region2})
        </Text>
      </View>
    </Pressable>
  );
}
