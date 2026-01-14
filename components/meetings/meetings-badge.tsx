import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

interface MeetingsBadgeProps {
  title: string;
  className?: string;
}

export default function MeetingsBadge({ title, className }: MeetingsBadgeProps) {
  return (
    <View className={cn('rounded-full bg-gray-100 px-2 py-1', className)}>
      <Text className="text-base text-gray-400">{title}</Text>
    </View>
  );
}
