import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import AddressInput from '@/components/address/address-input';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import DateTimePickerInput from '@/components/ui/date-time-picker-input';
import Input from '@/components/ui/input';
import Segment from '@/components/ui/segment';
import useSignUp from '@/hooks/mutations/use-sign-up';
import { useAddress } from '@/store/address';
import type { Gender } from '@/types/profile';
import { formatISODate } from '@/utils/date';
import { toast } from '@/utils/toast';

interface InitialValues {
  name: string;
  gender: Gender;
  birthDate: Date;
}

const initialValues: InitialValues = {
  name: '',
  gender: 'male',
  birthDate: new Date(),
};

const segmentOptions: Array<{ label: string; value: Gender }> = [
  { label: '남', value: 'male' },
  { label: '여', value: 'female' },
];

export default function SignUp() {
  const [values, setValues] = useState(initialValues);

  const address = useAddress();

  const { mutate: signUp, isPending: isSignUpPending } = useSignUp({
    onSuccess: () => {
      router.replace('/(tabs)');
    },
    onError: () => {
      toast.error('회원가입에 실패했습니다');
    },
  });

  const handleChange = <K extends keyof typeof initialValues>(
    field: K,
    value: (typeof initialValues)[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUpPress = () => {
    const { birthDate, ...restValues } = values;
    const { hCode, ...restAddress } = address;
    signUp({ birth_date: formatISODate(birthDate), ...restValues, h_code: hCode, ...restAddress });
  };

  return (
    <Screen hasHeader>
      <View className="gap-6">
        <View className="flex-row gap-4">
          <Input
            placeholder="이름"
            autoFocus
            className="flex-1"
            onChangeText={(text) => handleChange('name', text)}
          />
          <Segment
            options={segmentOptions}
            selectedValue={values.gender}
            onChange={(value) => handleChange('gender', value)}
            fontStyle={{ fontSize: 18 }}
            className="w-[35%]"
          />
        </View>

        <View className="flex-row gap-4">
          <DateTimePickerInput
            date={values.birthDate}
            onConfirm={(date) => handleChange('birthDate', date)}
            className="w-[40%]"
          />
          <AddressInput value={address.region3} className="flex-1" />
        </View>

        <Button title="가입하기" isLoading={isSignUpPending} onPress={handleSignUpPress} />
      </View>
    </Screen>
  );
}
