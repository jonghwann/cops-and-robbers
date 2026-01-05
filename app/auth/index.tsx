import { View } from 'react-native';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Title from '@/components/ui/title';

export default function Index() {
  return (
    <Screen>
      <Title>번호 인증</Title>

      <View className="gap-6">
        <View className="gap-4">
          <View className="flex-row gap-4">
            <Input className="flex-1" placeholder="01012345678" maxLength={11} />
            <Button title="번호 요청" className="w-32" />
          </View>

          <Input placeholder="인증번호를 입력하세요." maxLength={6} />
        </View>

        <Button title="다음" />
      </View>
    </Screen>
  );
}
