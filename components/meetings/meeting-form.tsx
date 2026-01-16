import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Input from '@/components/ui/input';
import useImagePicker from '@/hooks/use-image-picker';

interface MeetingFormValues {
  title: string;
  description: string;
  imageUri?: string;
}

interface Props {
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialDescription?: string;
  initialThumbnailUrl?: string | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: MeetingFormValues) => void;
}

export default function MeetingForm({
  mode,
  initialTitle = '',
  initialDescription = '',
  initialThumbnailUrl = null,
  submitLabel,
  isSubmitting,
  onSubmit,
}: Props) {
  const { pickImage } = useImagePicker();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => setTitle(initialTitle), [initialTitle]);
  useEffect(() => setDescription(initialDescription), [initialDescription]);

  const previewUri = imageUri ?? initialThumbnailUrl ?? '';

  const handlePickImage = async () => {
    const uri = await pickImage({ aspect: [20, 9] });
    if (uri) setImageUri(uri);
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || !trimmedDesc) return;

    if (mode === 'create' && !imageUri) return;

    onSubmit({ title: trimmedTitle, description: trimmedDesc, imageUri: imageUri ?? undefined });
  };

  return (
    <View className="gap-4">
      {previewUri ? (
        <Pressable onPress={handlePickImage}>
          <Image source={{ uri: previewUri }} className="aspect-[20/9] w-full rounded-lg" />
          <Text className="absolute right-3 bottom-2 text-white">이미지 변경</Text>
        </Pressable>
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

      <Input placeholder="모임 이름" value={title} onChangeText={setTitle} />

      <Input
        multiline
        textAlignVertical="top"
        placeholder="모임 목표를 설명해주세요."
        value={description}
        onChangeText={setDescription}
        className="h-52"
        inputClassName="h-full py-3"
      />

      <Button title={submitLabel} isLoading={isSubmitting} onPress={handleSubmit} />
    </View>
  );
}
