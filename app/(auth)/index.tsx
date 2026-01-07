import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import useSignInWithOtp from '@/hooks/mutations/use-sign-in-with-otp';
import useVerifyOtp from '@/hooks/mutations/use-verify-otp';
import { toE164 } from '@/utils/phone';
import { toast } from '@/utils/toast';

const initialValues = {
  phone: '',
  code: '',
};

export default function Index() {
  const [values, setValues] = useState(initialValues);
  const [isOtpRequested, setIsOtpRequested] = useState(false);

  const { mutate: signInWithOtp, isPending: isSignInWithOtpPending } = useSignInWithOtp({
    onSuccess: () => {
      setIsOtpRequested(true);
      toast.success('인증번호가 전송되었습니다');
    },
    onError: () => {
      toast.error('인증번호 전송에 실패했습니다');
    },
  });

  const { mutate: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    onSuccess: () => {
      router.replace('/sign-up');
    },
    onError: () => {
      toast.error('인증번호를 다시 확인해주세요');
    },
  });

  const handleChangeText = (field: keyof typeof initialValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignInWithOtpPress = async () => {
    router.replace('/sign-up');
    // signInWithOtp(toE164(values.phone));
  };

  const handleVerifyOtpPress = async () => {
    verifyOtp({ phone: toE164(values.phone), code: values.code });
  };

  return (
    <Screen>
      <View className="gap-6">
        <View className="gap-4">
          <View className="flex-row gap-4">
            <Input
              value={values.phone}
              placeholder="01012345678"
              maxLength={11}
              keyboardType="number-pad"
              autoFocus
              onChangeText={(text) => handleChangeText('phone', text)}
              className="flex-1"
            />
            <Button
              title={isOtpRequested ? '재전송' : '번호 요청'}
              isLoading={isSignInWithOtpPending}
              onPress={handleSignInWithOtpPress}
              className="w-[30%]"
            />
          </View>

          <Input
            value={values.code}
            placeholder="인증번호를 입력하세요."
            maxLength={6}
            keyboardType="number-pad"
            onChangeText={(text) => handleChangeText('code', text)}
          />
        </View>

        <Button
          title="다음"
          disabled={!isOtpRequested}
          isLoading={isVerifyOtpPending}
          onPress={handleVerifyOtpPress}
        />
      </View>
    </Screen>
  );
}
