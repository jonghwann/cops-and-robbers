import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import type { ChatMessage } from '@/api/chat/type';
import Icon from '@/components/ui/icon';
import { formatChatTime } from '@/utils/date';

interface ChatMessageItemProps {
  message: ChatMessage;
  showProfile?: boolean;
}

export default function ChatMessageItem({ message, showProfile = true }: ChatMessageItemProps) {
  const { userName, userAvatarUrl, content, createdAt, isOwn } = message;

  if (isOwn) {
    return (
      <View className="flex-row justify-end">
        <View className="max-w-[70%] items-end">
          <View className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2">
            <Text className="text-lg text-white">{content}</Text>
          </View>
          <Text className="mt-1 text-gray-400 text-sm">{formatChatTime(createdAt)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row">
      {showProfile ? (
        userAvatarUrl ? (
          <View className="mr-2 size-10 overflow-hidden rounded-full">
            <Image source={{ uri: userAvatarUrl }} style={{ width: 40, height: 40 }} />
          </View>
        ) : (
          <View className="relative mr-2 size-10 rounded-full bg-gray-200">
            <Icon
              name="person"
              size={20}
              color="gray"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </View>
        )
      ) : (
        <View className="mr-2 w-10" />
      )}

      <View className="max-w-[70%]">
        {showProfile && (
          <Text className="mb-1 font-medium text-base text-gray-600">{userName}</Text>
        )}
        <View className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2">
          <Text className="text-lg">{content}</Text>
        </View>
        <Text className="mt-1 text-gray-400 text-sm">{formatChatTime(createdAt)}</Text>
      </View>
    </View>
  );
}
