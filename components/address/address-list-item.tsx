import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import useUpdateProfile from '@/hooks/mutations/use-update-profile';
import { useSetAddress } from '@/store/address';
import type { Address } from '@/types/profile';
import { toast } from '@/utils/toast';

export default function AddressListItem(address: Address) {
  const { from } = useLocalSearchParams();

  const setAddress = useSetAddress();

  const { mutate: updateProfile } = useUpdateProfile({
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error('주소 변경에 실패했습니다.');
    },
  });

  const handlePress = async () => {
    if (from === 'home') {
      const { hCode, ...restAddress } = address;
      updateProfile({ h_code: hCode, ...restAddress });
    } else {
      setAddress(address);
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} className="active:bg-gray-100">
      <View className="flex-row items-center gap-2 border-gray-100 border-b px-2 py-5">
        <Text className="text-xl">{address.region3}</Text>
        <Text className="text-base text-gray-300">
          ({address.region1} {address.region2})
        </Text>
      </View>
    </Pressable>
  );
}
