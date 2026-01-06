import SegmentedControl, {
  type SegmentedControlProps,
} from '@react-native-segmented-control/segmented-control';
import { View } from 'react-native';
import { cn } from '@/lib/cn';

type SegmentOption = {
  label: string;
  value: string;
};

interface SegmentProps
  extends Omit<SegmentedControlProps, 'values' | 'selectedIndex' | 'onChange'> {
  options: SegmentOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Segment({
  options,
  selectedValue,
  onChange,
  className,
  ...props
}: SegmentProps) {
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const labels = options.map((option) => option.label);

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
        fontStyle={{ fontSize: 18 }}
        {...props}
      />
    </View>
  );
}
