import { Ionicons } from '@expo/vector-icons';
import { TextInput, type TextInputProps, View } from 'react-native';
import { cn } from '@/lib/cn';

interface InputProps extends TextInputProps {
  icon?: React.ComponentProps<typeof Ionicons>;
  className?: string;
  inputClassName?: string;
}

export default function Input({ icon, className, inputClassName, ...props }: InputProps) {
  return (
    <View className={cn('h-14 flex-row items-center rounded-lg bg-gray-100 px-4', className)}>
      {icon && <Ionicons {...icon} />}

      <TextInput
        {...props}
        className={cn('flex-1 text-2xl placeholder:text-gray-400', icon && 'ml-2', inputClassName)}
      />
    </View>
  );
}
