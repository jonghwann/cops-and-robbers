import Screen from '@/components/layout/screen';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';

export default function MyMeetings() {
  return (
    <Screen>
      <Result
        figure={<Icon name="information-circle-outline" size={100} />}
        title="아직 참여 중인 모임이 없어요"
        description="모임에 참여하거나 직접 만들어보세요"
      />
    </Screen>
  );
}
