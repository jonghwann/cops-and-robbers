import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { cn } from '@/lib/cn';

interface IconProps extends React.ComponentProps<typeof Ionicons> {
  className?: string;
}

export default function Icon({ className, ...props }: IconProps) {
  return (
    <Ionicons
      suppressHighlighting
      {...props}
      className={cn(Platform.OS === 'android' && 'translate-y-[2px]', className)}
    />
  );
}
