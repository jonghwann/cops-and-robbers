import { useState } from 'react';
import { Pressable, View } from 'react-native';
import DateTimePickerModal, {
  type ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import Input from './input';

interface DateTimePickerInputProps
  extends Omit<
    ReactNativeModalDateTimePickerProps,
    'date' | 'isVisible' | 'onConfirm' | 'onCancel'
  > {
  date: Date;
  onConfirm?: (date: Date) => void;
  className?: string;
}

export default function DateTimePickerInput({
  date,
  onConfirm,
  className,
  ...props
}: DateTimePickerInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleInputPress = () => {
    setIsVisible(true);
  };

  const handleConfirm = (date: Date) => {
    onConfirm?.(date);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <View className={className}>
      <Pressable onPress={handleInputPress}>
        <Input
          value={date.toLocaleDateString('ko-KR').replace(/\.$/, '')}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <DateTimePickerModal
        date={date}
        isVisible={isVisible}
        mode="date"
        locale="ko-KR"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        textColor="#000000"
        pickerStyleIOS={{ alignItems: 'center' }}
        {...props}
      />
    </View>
  );
}
