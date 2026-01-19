import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import ScheduleForm from '@/components/schedule/schedule-form';
import useDeleteMeetingSchedule from '@/hooks/mutations/use-delete-meeting-schedule';
import useUpdateMeetingSchedule from '@/hooks/mutations/use-update-meeting-schedule';
import useMeetingSchedules from '@/hooks/queries/use-meeting-schedules';
import { useClearPlace } from '@/store/place';
import { toast } from '@/utils/toast';

export default function Edit() {
  const { id: meetingId, scheduleId } = useLocalSearchParams<{ id: string; scheduleId: string }>();

  const clearPlace = useClearPlace();

  const { data: schedules } = useMeetingSchedules(meetingId);
  const schedule = schedules?.find((schedule) => schedule.id === scheduleId);

  const { mutate: updateSchedule, isPending: isUpdatingMeetingSchedulePending } =
    useUpdateMeetingSchedule(meetingId);
  const { mutate: deleteSchedule } = useDeleteMeetingSchedule(meetingId);

  useEffect(() => {
    clearPlace();
  }, [clearPlace]);

  if (!schedule) return null;

  const handleDelete = () => {
    Alert.alert('일정을 삭제할까요?', '삭제하면 되돌릴 수 없어요', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () =>
          deleteSchedule(scheduleId, {
            onSuccess: () => {
              clearPlace();
              router.back();
            },
            onError: () => toast.error('일정 삭제에 실패했습니다'),
          }),
      },
    ]);
  };

  return (
    <Screen hasHeader>
      <View className="gap-4">
        <ScheduleForm
          mode="edit"
          submitLabel="저장"
          isSubmitting={isUpdatingMeetingSchedulePending}
          initialTitle={schedule.title}
          initialStartsAt={schedule.startsAt}
          initialLocationName={schedule.locationName}
          initialLocationUrl={schedule.locationUrl}
          initialCapacity={schedule.capacity}
          onPressPickLocation={() => router.push('/(screen)/place-search')}
          onSubmit={(values) =>
            updateSchedule(
              { scheduleId, ...values },
              {
                onSuccess: () => {
                  clearPlace();
                  router.back();
                },
                onError: () => toast.error('일정 수정에 실패했습니다'),
              },
            )
          }
        />

        <Text
          suppressHighlighting
          selectable={false}
          className="text-gray-400 text-lg underline"
          onPress={handleDelete}
        >
          일정 삭제하기
        </Text>
      </View>
    </Screen>
  );
}
