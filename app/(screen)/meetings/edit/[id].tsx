import { router, useLocalSearchParams } from 'expo-router';
import Screen from '@/components/layout/screen';
import MeetingForm from '@/components/meetings/meeting-form';
import useUpdateMeeting from '@/hooks/mutations/use-update-meeting';
import useMeetingById from '@/hooks/queries/use-meeting-by-id';
import { toast } from '@/utils/toast';

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: meeting } = useMeetingById(id, 'detail');
  const { mutate: updateMeeting, isPending: isUpdatingMeetingPending } = useUpdateMeeting({
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error('모임 수정에 실패했습니다');
    },
  });

  if (!meeting) return null;

  const { title, description, thumbnailUrl } = meeting;

  return (
    <Screen hasHeader>
      <MeetingForm
        mode="edit"
        initialTitle={title}
        initialDescription={description}
        initialThumbnailUrl={thumbnailUrl}
        submitLabel="모임 수정하기"
        isSubmitting={isUpdatingMeetingPending}
        onSubmit={({ title, description, imageUri }) => {
          updateMeeting({ meetingId: id, title, description, imageUri });
        }}
      />
    </Screen>
  );
}
