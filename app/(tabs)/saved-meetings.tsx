import { FlatList } from 'react-native';
import Screen from '@/components/layout/screen';
import MeetingListItem from '@/components/meetings/meetings-list-item';
import Icon from '@/components/ui/icon';
import Result from '@/components/ui/result';
import useSavedMeetings from '@/hooks/queries/use-saved-meetings';

export default function SavedMeetings() {
  const { data: meetings } = useSavedMeetings();

  return (
    <Screen>
      {meetings?.length === 0 ? (
        <Result
          figure={<Icon name="information-circle-outline" size={100} />}
          title="찜 목록이 비어 있어요"
          description="모임에서 하트를 눌러 찜을 추가해보세요"
        />
      ) : (
        <FlatList
          data={meetings ?? []}
          keyExtractor={(id) => id}
          renderItem={({ item }) => <MeetingListItem id={item} />}
          contentContainerClassName="gap-4"
        />
      )}
    </Screen>
  );
}
