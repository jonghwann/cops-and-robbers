import type { TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';
import Input from './input';

interface SearchFieldProps extends TextInputProps {
  className?: string;
  inputClassName?: string;
}

export default function SearchField({ className, inputClassName, ...props }: SearchFieldProps) {
  return (
    <Input
      icon={{ name: 'search', size: 18, color: 'black' }}
      className={cn('h-12 rounded-full bg-gray-100', className)}
      inputClassName={cn('text-lg leading-6', inputClassName)}
      {...props}
    />
  );
}
