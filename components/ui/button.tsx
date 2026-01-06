import { ActivityIndicator, Pressable, type PressableProps, Text } from 'react-native';
import { cn } from '@/lib/cn';

interface ButtonProps extends PressableProps {
  title: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function Button({ title, disabled, isLoading, className, ...props }: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        'h-14 items-center justify-center rounded-lg bg-primary px-4',
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="font-semibold text-2xl text-white">{title}</Text>
      )}
    </Pressable>
  );
}
