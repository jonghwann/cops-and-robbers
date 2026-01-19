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
  mode?: 'date' | 'time' | 'datetime';
  date: Date;
  onConfirm?: (date: Date) => void;
  className?: string;
}

export default function DateTimePickerInput({
  mode = 'date',
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

  const formatDate = (date: Date, mode: 'date' | 'time' | 'datetime') => {
    if (mode === 'time') {
      return date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
    }
    if (mode === 'datetime') {
      return `${date.toLocaleDateString('ko-KR').replace(/\.$/, '')} ${date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('ko-KR').replace(/\.$/, '');
  };

  return (
    <View className={className}>
      <Pressable onPress={handleInputPress}>
        <Input value={formatDate(date, mode)} editable={false} pointerEvents="none" />
      </Pressable>

      <DateTimePickerModal
        date={date}
        isVisible={isVisible}
        mode={mode}
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
