import SegmentedControl, {
  type SegmentedControlProps,
} from '@react-native-segmented-control/segmented-control';
import { View } from 'react-native';
import { cn } from '@/lib/cn';

type SegmentOption<T> = {
  label: string;
  value: T;
};

interface SegmentProps<T>
  extends Omit<SegmentedControlProps, 'values' | 'selectedIndex' | 'onChange'> {
  options: SegmentOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function Segment<T>({
  options,
  selectedValue,
  onChange,
  className,
  ...props
}: SegmentProps<T>) {
  const labels = options.map((option) => option.label);
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);

  return (
    <View className={cn('h-14', className)}>
      <SegmentedControl
        values={labels}
        selectedIndex={selectedIndex}
        onChange={(e) => {
          const index = e.nativeEvent.selectedSegmentIndex;
          onChange(options[index].value);
        }}
        style={{ height: '100%' }}
        {...props}
      />
    </View>
  );
}
