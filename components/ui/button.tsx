import { Pressable, type PressableProps, Text } from 'react-native';
import { cn } from '@/lib/cn';

interface ButtonProps extends PressableProps {
  title: string;
  className?: string;
}

export default function Button({ title, className, ...props }: ButtonProps) {
  return (
    <Pressable
      className={cn('h-14 items-center justify-center rounded-lg bg-primary p-2', className)}
      {...props}
    >
      <Text className="font-semibold text-2xl text-white">{title}</Text>
    </Pressable>
  );
}
