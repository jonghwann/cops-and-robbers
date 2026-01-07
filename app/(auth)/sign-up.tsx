import { useState } from 'react';
import { View } from 'react-native';
import AddressInput from '@/components/address/address-input';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import DateTimePickerInput from '@/components/ui/date-time-picker-input';
import Input from '@/components/ui/input';
import Segment from '@/components/ui/segment';
import { useAddress } from '@/store/address';

const initialValues = {
  name: '',
  gender: 'male',
  birthDate: new Date(),
  address: '',
};

const segmentOptions = [
  { label: '남', value: 'male' },
  { label: '여', value: 'female' },
];

export default function SignUp() {
  const [values, setValues] = useState(initialValues);

  const { region1, region2, region3, hCode } = useAddress();

  const handleChangeText = (text: string) => {
    setValues((prev) => ({ ...prev, name: text }));
  };

  const handleSegmentChange = (value: string) => {
    setValues((prev) => ({ ...prev, gender: value }));
  };

  const handleBirthDateChange = (date: Date) => {
    setValues((prev) => ({ ...prev, birthDate: date }));
  };

  const handleSignUpPress = () => {
    console.log(values);
  };

  return (
    <Screen hasHeader>
      <View className="gap-6">
        <View className="flex-row gap-4">
          <Input placeholder="이름" autoFocus className="flex-1" onChangeText={handleChangeText} />
          <Segment
            options={segmentOptions}
            selectedValue={values.gender}
            onChange={handleSegmentChange}
            className="w-[35%]"
          />
        </View>

        <View className="flex-row gap-4">
          <DateTimePickerInput
            date={values.birthDate}
            onConfirm={handleBirthDateChange}
            className="w-[40%]"
          />
          <AddressInput value={region3} className="flex-1" />
        </View>

        <Button title="가입하기" onPress={handleSignUpPress} />
      </View>
    </Screen>
  );
}
