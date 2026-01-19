import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import Screen from '@/components/layout/screen';
import ScheduleForm from '@/components/schedule/schedule-form';
import useCreateMeetingSchedule from '@/hooks/mutations/use-create-meeting-schedule';
import { useClearPlace } from '@/store/place';
import { toast } from '@/utils/toast';

export default function Create() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const clearPlace = useClearPlace();

  const { mutate: createSchedule, isPending: isCreatingMeetingSchedulePending } =
    useCreateMeetingSchedule(id);

  useEffect(() => {
    clearPlace();
  }, [clearPlace]);

  return (
    <Screen hasHeader>
      <ScheduleForm
        mode="create"
        submitLabel="일정 만들기"
        isSubmitting={isCreatingMeetingSchedulePending}
        onPressPickLocation={() => router.push('/(screen)/place-search')}
        onSubmit={(values) =>
          createSchedule(
            { meetingId: id, ...values },
            {
              onSuccess: () => {
                clearPlace();
                router.back();
              },
              onError: () => toast.error('일정 만들기에 실패했습니다'),
            },
          )
        }
      />
    </Screen>
  );
}
