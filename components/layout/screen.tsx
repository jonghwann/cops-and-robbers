import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

interface ScreenProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  hasHeader?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Screen({ edges, hasHeader = false, children, className }: ScreenProps) {
  return (
    <SafeAreaView
      edges={
        edges ? edges : hasHeader ? ['left', 'right', 'bottom'] : ['top', 'left', 'right', 'bottom']
      }
      className={cn('flex-1 bg-white px-5', className)}
    >
      {children}
    </SafeAreaView>
  );
}
