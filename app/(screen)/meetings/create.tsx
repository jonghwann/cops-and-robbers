import { router } from 'expo-router';
import Screen from '@/components/layout/screen';
import MeetingForm from '@/components/meetings/meeting-form';
import useCreateMeeting from '@/hooks/mutations/use-create-meeting';
import useProfile from '@/hooks/queries/use-profile';
import { toast } from '@/utils/toast';

export default function Create() {
  const { data: profile } = useProfile();
  const region2 = profile?.region2 ?? '';

  const { mutate: createMeeting, isPending } = useCreateMeeting(region2, {
    onSuccess: (data) => {
      router.replace(`/meetings/${data.id}`);
    },
    onError: () => {
      toast.error('모임 생성에 실패했습니다');
    },
  });

  return (
    <Screen hasHeader>
      <MeetingForm
        mode="create"
        submitLabel="모임 만들기"
        isSubmitting={isPending}
        onSubmit={({ title, description, imageUri }) => {
          if (!imageUri) return;
          createMeeting({ region2, title, description, imageUri });
        }}
      />
    </Screen>
  );
}
