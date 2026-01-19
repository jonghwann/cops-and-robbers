import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import type { ChatMessage } from '@/api/chat/type';
import ChatInput from '@/components/chat/chat-input';
import ChatMessageItem from '@/components/chat/chat-message-item';
import Screen from '@/components/layout/screen';
import { BACK_SCREEN_OPTIONS } from '@/constants/screens';
import useSendMessage from '@/hooks/mutations/use-send-message';
import useChatMessages from '@/hooks/queries/use-chat-messages';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import { toast } from '@/utils/toast';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: meeting } = useMeetingById(id, 'detail');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isChatMessagesLoading,
  } = useChatMessages(id);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage({
    onError: () => {
      toast.error('메시지 전송에 실패했습니다');
    },
  });

  const messages = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.messages);
  }, [data]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage({ meetingId: id, content });
    },
    [id, sendMessage],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const prevMessage = messages[index + 1];
      const showProfile = !prevMessage || prevMessage.userId !== item.userId;

      return (
        <View className="px-4 py-1">
          <ChatMessageItem message={item} showProfile={showProfile} />
        </View>
      );
    },
    [messages],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <Screen edges={['left', 'right']} className="px-0">
      <Stack.Screen
        options={{
          ...BACK_SCREEN_OPTIONS,
          title: meeting?.title ?? '채팅',
        }}
      />

      <KeyboardAvoidingView className="flex-1">
        {isChatMessagesLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            inverted
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.6}
            ListFooterComponent={renderFooter}
            contentContainerClassName="py-4"
          />
        )}

        <ChatInput onSend={handleSend} isLoading={isSending} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
