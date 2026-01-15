import { Link } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';
import Icon from '../ui/icon';

interface MeetingsButtonProps {
  className?: string;
}

export default function CreateMeetingFab({ className }: MeetingsButtonProps) {
  const insets = useSafeAreaInsets();
  const base = Platform.OS === 'ios' ? 72 : 88;

  return (
    <Link href="/(screen)/meetings/create" asChild>
      <Pressable
        className={cn(
          'absolute right-5 size-16 items-center justify-center rounded-full bg-primary',
          className,
        )}
        style={{ bottom: insets.bottom + base }}
      >
        <Icon name="add" size={28} color="white" />
      </Pressable>
    </Link>
  );
}
