import { Ionicons } from '@expo/vector-icons';
import { TextInput, type TextInputProps, View } from 'react-native';
import { cn } from '@/lib/cn';

interface InputProps extends TextInputProps {
  icon?: { name: React.ComponentProps<typeof Ionicons>['name']; size?: number; color?: string };
  className?: string;
  inputClassName?: string;
}

export default function Input({ icon, className, inputClassName, ...props }: InputProps) {
  return (
    <View className={cn('h-14 flex-row items-center rounded-lg bg-gray-200 px-4', className)}>
      {icon && <Ionicons {...icon} />}

      <TextInput
        className={cn('flex-1 text-2xl placeholder:text-gray-400', icon && 'ml-2', inputClassName)}
        {...props}
      />
    </View>
  );
}
