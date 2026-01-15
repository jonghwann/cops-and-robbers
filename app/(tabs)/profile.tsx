import { FlatList } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';
import Title from '@/components/ui/title';
import { useRecentMeetings } from '@/hooks/queries/use-recent-meeting';

export default function Profile() {
  const { data: recentMeetings } = useRecentMeetings();
  return (
    <Screen>
      <Title title="프로필" />

      <Title title="최근 본 모임" />

      {recentMeetings?.length === 0 ? (
        <Result
          figure={<Icon name="information-circle-outline" size={100} />}
          title="최근 본 모임이 없어요"
          description="모임을 보면 최근 본 모임에 추가됩니다"
        />
      ) : (
        <FlatList data={recentMeetings} renderItem={({ item }) => <MeetingListItem id={item} />} />
      )}
    </Screen>
  );
}
