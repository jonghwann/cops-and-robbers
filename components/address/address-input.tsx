import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import Input from '../ui/input';

interface AddressInputProps {
  value?: string;
  className?: string;
}

export default function AddressInput({ value, className }: AddressInputProps) {
  return (
    <Link href="/address-search" asChild>
      <Pressable className={className}>
        <Input value={value} placeholder="주소" editable={false} pointerEvents="none" />
      </Pressable>
    </Link>
  );
}
