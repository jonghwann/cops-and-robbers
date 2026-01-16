import { format } from 'date-fns';
import { useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';
import Title from '@/components/ui/title';
import useUploadProfileAvatar from '@/hooks/mutations/use-upload-profile-avatar';
import useProfile from '@/hooks/queries/use-profile';
import { useRecentMeetings } from '@/hooks/queries/use-recent-meeting';
import useImagePicker from '@/hooks/use-image-picker';

export default function Profile() {
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const { data: profile } = useProfile();
  const { data: recentMeetings } = useRecentMeetings();
  const { pickImage } = useImagePicker();
  const { mutate: uploadProfileAvatar } = useUploadProfileAvatar({
    onSuccess: (data) => {
      setLocalAvatarUri(data);
    },
  });

  const handleAvatarPress = async () => {
    const uri = await pickImage();
    if (!uri) return;

    setLocalAvatarUri(uri);
    uploadProfileAvatar(uri);
  };

  const avatarUri = localAvatarUri ?? profile?.avatarUrl ?? null;

  return (
    <Screen>
      <Title title="프로필" />

      <View className="mb-10 flex-row items-center gap-4">
        <Pressable onPress={handleAvatarPress} className="relative">
          <View className="size-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="size-24" />
            ) : (
              <Icon name="person-outline" size={40} color="black" />
            )}
          </View>

          <View className="absolute right-0 bottom-0 rounded-full bg-white p-1 shadow-md">
            <Icon name="pencil" size={16} color="black" />
          </View>
        </Pressable>

        <View className="gap-1">
          <Text className="font-bold text-2xl">{profile?.name}</Text>

          <Text className="text-gray-400 text-lg">
            {profile?.region1} · {format(new Date(profile?.birthDate ?? ''), 'yyyy.MM.dd')}
          </Text>
        </View>
      </View>

      <Title title="최근 본 모임" />

      {recentMeetings?.length === 0 ? (
        <Result
          figure={<Icon name="information-circle-outline" size={100} />}
          title="최근 본 모임이 없어요"
          description="모임을 보면 최근 본 모임에 추가됩니다"
        />
      ) : (
        <FlatList
          data={recentMeetings}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <MeetingListItem id={item} />}
          contentContainerClassName="gap-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
