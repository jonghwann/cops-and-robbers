import { Pressable, Text, View } from 'react-native';
import type { MeetingSchedule } from '@/api/meetings/type';
import Icon from '@/components/ui/icon';
import useJoinSchedule from '@/hooks/mutations/use-join-schedule';
import useLeaveSchedule from '@/hooks/mutations/use-leave-schedule';
import Button from '../ui/button';

interface ScheduleListItemProps {
  schedule: MeetingSchedule;
  onPress?: () => void;
}

export default function ScheduleListItem({ schedule, onPress }: ScheduleListItemProps) {
  const { id, meetingId, title, startsAt, locationName, capacity, memberCount, isJoined } =
    schedule;

  const date = new Date(startsAt);

  const month = date.toLocaleDateString('ko-KR', { month: 'long' });
  const day = date.getDate();
  const formattedTime = date.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const { mutate: joinSchedule, isPending: isPendingJoinSchedule } = useJoinSchedule(meetingId);
  const { mutate: leaveSchedule, isPending: isPendingLeaveSchedule } = useLeaveSchedule(meetingId);

  const handleJoinPress = () => {
    isJoined ? leaveSchedule(id) : joinSchedule(id);
  };

  return (
    <Pressable onPress={onPress} className="flex-row items-start gap-6 rounded-xl">
      <View className="items-center rounded-lg bg-gray-100 p-2">
        <Text className="text-gray-500">{month}</Text>
        <Text className="font-bold text-2xl">{day}</Text>
      </View>

      <View className="flex-1">
        <Text className="mb-2 font-bold text-xl">{title}</Text>

        <View className="mb-2 flex-row items-center gap-1">
          <Icon name="location-outline" size={20} />
          <Text className="text-lg">{locationName}</Text>
        </View>

        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Icon name="time-outline" size={20} />
            <Text className="text-lg">{formattedTime}</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Icon name="people-outline" size={20} />
            <Text className="text-lg">
              {memberCount}/{capacity}명
            </Text>
          </View>
        </View>

        <Button
          title={isJoined ? '취소' : '참석'}
          isLoading={isPendingJoinSchedule || isPendingLeaveSchedule}
          onPress={handleJoinPress}
          className="h-12"
          textClassName="text-lg"
        />
      </View>
    </Pressable>
  );
}
