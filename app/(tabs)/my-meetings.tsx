import { FlatList } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';
import Title from '@/components/ui/title';
import { useMyMeetings } from '@/hooks/queries/use-my-meetings';

export default function MyMeetings() {
  const { data: myMeetings } = useMyMeetings();

  return (
    <Screen>
      <Title title="내 모임" />

      {myMeetings?.length === 0 ? (
        <Result
          figure={<Icon name="information-circle-outline" size={100} />}
          title="아직 참여 중인 모임이 없어요"
          description="모임에 참여하거나 직접 만들어보세요"
        />
      ) : (
        <FlatList
          data={myMeetings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MeetingListItem id={item.id} />}
          contentContainerClassName="gap-4"
        />
      )}
    </Screen>
  );
}
