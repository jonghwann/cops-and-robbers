import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  Pressable,
  type PressableProps,
  Text,
  type TextProps,
} from 'react-native';
import { cn } from '@/lib/cn';

interface ButtonProps extends PressableProps {
  title: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  textProps?: Omit<TextProps, 'className'>;
  textClassName?: string;
  indicatorProps?: ActivityIndicatorProps;
}

export default function Button({
  title,
  disabled,
  isLoading,
  className,
  textProps,
  textClassName,
  indicatorProps,
  ...props
}: ButtonProps) {
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
        <ActivityIndicator color="white" {...indicatorProps} />
      ) : (
        <Text className={cn('font-semibold text-2xl text-white', textClassName)} {...textProps}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
