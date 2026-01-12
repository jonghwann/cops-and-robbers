import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import Icon from './icon';

interface TitleProps {
  title: string;
  icon?: React.ComponentProps<typeof Icon>;
  onPress?: () => void;
  className?: string;
  titleClassName?: string;
}

export default function Title({ title, icon, onPress, className, titleClassName }: TitleProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container onPress={onPress} className={cn('mb-8 flex-row items-center', className)}>
      <Text className={cn('font-bold text-3xl', titleClassName)}>{title}</Text>
      {icon && <Icon {...icon} />}
    </Container>
  );
}
