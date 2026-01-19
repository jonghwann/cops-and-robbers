import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Icon from '@/components/ui/icon';
import Input from '../ui/input';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setMessage('');
  };

  return (
    <View className="flex-row items-end gap-2 border-gray-200 border-t bg-white px-4 py-3">
      <View className="max-h-32 min-h-12 flex-1 justify-center rounded-full bg-gray-100 px-4">
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
          multiline
        />
      </View>

      <Pressable
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
        className="size-12 items-center justify-center rounded-full bg-primary disabled:opacity-50"
      >
        <Icon name="send" size={20} color="white" />
      </Pressable>
    </View>
  );
}
