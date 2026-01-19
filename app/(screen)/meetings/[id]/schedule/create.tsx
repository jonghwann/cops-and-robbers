import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Screen from '@/components/layout/screen';
import Button from '@/components/ui/button';
import DateTimePickerInput from '@/components/ui/date-time-picker-input';
import Icon from '@/components/ui/icon';
import Input from '@/components/ui/input';
import useCreateMeetingSchedule from '@/hooks/mutations/use-create-meeting-schedule';
import { useClearPlace, usePlace } from '@/store/place';
import { toast } from '@/utils/toast';

const initialValues = {
  title: '',
  date: new Date(),
  time: new Date(),
  location: '',
  capacity: 2,
};

export default function Create() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [values, setValues] = useState(initialValues);

  const place = usePlace();
  const clearPlace = useClearPlace();

  const { mutate: createSchedule, isPending: isCreateMeetingSchedulePending } =
    useCreateMeetingSchedule(id);

  const handleChange = <K extends keyof typeof initialValues>(
    field: K,
    value: (typeof initialValues)[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const startsAt = new Date(values.date);
    startsAt.setHours(values.time.getHours(), values.time.getMinutes());

    createSchedule(
      {
        meetingId: id,
        title: values.title,
        startsAt: startsAt.toISOString(),
        locationName: place?.name ?? '',
        locationUrl: place?.url ?? '',
        capacity: values.capacity,
      },
      {
        onSuccess: () => {
          clearPlace();
          router.back();
        },
        onError: () => {
          toast.error('일정 만들기에 실패했습니다');
        },
      },
    );
  };

  return (
    <Screen hasHeader>
      <View className="gap-4">
        <View className="flex-row items-center gap-2">
          <Icon name="create-outline" size={24} color="black" />
          <Input
            value={values.title}
            placeholder="제목"
            onChangeText={(text) => handleChange('title', text)}
            className="flex-1"
          />
        </View>

        <View className="flex-row items-center gap-2">
          <Icon name="calendar-outline" size={24} color="black" />
          <DateTimePickerInput
            date={values.date}
            onConfirm={(date) => handleChange('date', date)}
            className="flex-1"
          />
        </View>

        <View className="flex-row items-center gap-2">
          <Icon name="time-outline" size={24} color="black" />
          <DateTimePickerInput
            mode="time"
            date={values.time}
            onConfirm={(date) => handleChange('time', date)}
            className="flex-1"
          />
        </View>

        <View className="flex-row items-center gap-2">
          <Icon name="location-outline" size={24} color="black" />
          <Input value={place?.name} placeholder="장소" className="flex-1" />
          <Button title="위치 추가" onPress={() => router.push('/(screen)/place-search')} />
        </View>

        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-2">
            <Icon name="people-outline" size={24} color="black" />
            <Text className="text-xl">정원 (2명 이상)</Text>
          </View>

          <Input
            value={values.capacity.toString()}
            maxLength={3}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange('capacity', Number(text))}
            className="flex-1"
          />
        </View>

        <Button
          title="일정 만들기"
          isLoading={isCreateMeetingSchedulePending}
          onPress={handleSubmit}
        />
      </View>
    </Screen>
  );
}
