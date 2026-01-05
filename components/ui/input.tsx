import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';

interface InputProps extends TextInputProps {
  className?: string;
}

export default function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'h-14 rounded-lg bg-secondary p-2 text-2xl placeholder:text-tertiary',
        className,
      )}
      {...props}
    />
  );
}
