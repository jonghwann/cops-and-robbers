import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import Input from '../ui/input';

interface AddressInputProps {
  value?: string;
  className?: string;
  inputProps?: React.ComponentProps<typeof Input>;
}

export default function AddressInput({ value, className, inputProps }: AddressInputProps) {
  return (
    <Link href="/(screen)/address-search" asChild>
      <Pressable className={className}>
        <Input
          value={value}
          placeholder="주소"
          editable={false}
          pointerEvents="none"
          {...inputProps}
        />
      </Pressable>
    </Link>
  );
}
