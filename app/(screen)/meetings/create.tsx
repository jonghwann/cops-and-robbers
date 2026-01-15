import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Input from '@/components/ui/input';
import useCreateMeeting from '@/hooks/mutations/use-create-meeting';
import useProfile from '@/hooks/queries/use-profile';
import useImagePicker from '@/hooks/use-image-picker';
import { toast } from '@/utils/toast';

const initialValues = {
  title: '',
  description: '',
  image: '',
};

export default function Create() {
  const [values, setValues] = useState(initialValues);

  const { data: profile } = useProfile();
  const { image, pickImage } = useImagePicker();
  const { mutate: createMeeting, isPending: isPendingCreateMeeting } = useCreateMeeting(
    profile?.region2 ?? '',
    {
      onSuccess: (data) => {
        router.replace(`/meetings/${data.id}`);
      },
      onError: () => {
        toast.error('모임 생성에 실패했습니다');
      },
    },
  );

  const handlePickImage = async () => {
    const uri = await pickImage({ aspect: [20, 9] });
    if (uri) setValues((prev) => ({ ...prev, image: uri }));
  };

  const handleChangeText = (field: keyof typeof initialValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateMeeting = () => {
    createMeeting({
      region2: profile?.region2 ?? '',
      imageUri: values.image,
      title: values.title,
      description: values.description,
    });
  };

  return (
    <Screen hasHeader>
      <View className="gap-4">
        {image ? (
          <Image source={{ uri: values.image }} className="aspect-[20/9] w-full rounded-lg" />
        ) : (
          <Pressable
            onPress={handlePickImage}
            className="items-center justify-center gap-2 rounded-lg border border-primary p-16"
          >
            <Icon name="image-outline" size={24} color="#48a0f8" />
            <Text className="text-primary">이미지 추가</Text>
            <Text className="absolute right-3 bottom-2 text-primary">비율 20:9</Text>
          </Pressable>
        )}

        <Input placeholder="모임 이름" onChangeText={handleChangeText('title')} />

        <Input
          multiline
          textAlignVertical="top"
          placeholder="모임 목표를 설명해주세요."
          onChangeText={handleChangeText('description')}
          className="h-52"
          inputClassName="h-full py-3"
        />

        <Button
          title="모임 만들기"
          isLoading={isPendingCreateMeeting}
          onPress={handleCreateMeeting}
        />
      </View>
    </Screen>
  );
}
