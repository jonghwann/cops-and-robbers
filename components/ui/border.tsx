import { View } from 'react-native';
import { cn } from '@/lib/cn';

interface BorderProps {
  className?: string;
}

export default function Border({ className }: BorderProps) {
  return <View className={cn('-mx-5 h-1.5 bg-gray-100', className)} />;
}
