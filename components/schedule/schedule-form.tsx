import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Button from '@/components/ui/button';
import DateTimePickerInput from '@/components/ui/date-time-picker-input';
import Icon from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { usePlace } from '@/store/place';

export interface ScheduleFormValues {
  title: string;
  startsAt: string;
  locationName: string;
  locationUrl: string;
  capacity: number;
}

interface Props {
  mode: 'create' | 'edit';
  submitLabel: string;
  isSubmitting?: boolean;
  onPressPickLocation: () => void;
  onSubmit: (values: ScheduleFormValues) => void;
  initialTitle?: string;
  initialStartsAt?: string;
  initialLocationName?: string;
  initialLocationUrl?: string;
  initialCapacity?: number;
}

export default function ScheduleForm({
  mode,
  submitLabel,
  isSubmitting,
  onPressPickLocation,
  onSubmit,
  initialTitle = '',
  initialStartsAt,
  initialLocationName = '',
  initialLocationUrl = '',
  initialCapacity = 2,
}: Props) {
  const place = usePlace();

  const initialDateTime = useMemo(() => {
    if (!initialStartsAt) return null;
    const d = new Date(initialStartsAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [initialStartsAt]);

  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState<Date>(initialDateTime ?? new Date());
  const [time, setTime] = useState<Date>(initialDateTime ?? new Date());
  const [capacity, setCapacity] = useState<number>(initialCapacity);

  useEffect(() => setTitle(initialTitle), [initialTitle]);
  useEffect(() => setCapacity(initialCapacity), [initialCapacity]);
  useEffect(() => {
    if (!initialDateTime) return;
    setDate(initialDateTime);
    setTime(initialDateTime);
  }, [initialDateTime]);

  const locationName = (place?.name ?? initialLocationName).trim();
  const locationUrl = (place?.url ?? initialLocationUrl).trim();

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const startsAt = new Date(date);
    startsAt.setHours(time.getHours(), time.getMinutes(), 0, 0);

    if (!locationName || !locationUrl) return;
    if (!Number.isFinite(capacity) || capacity < 2) return;
    if (mode === 'create' && !place) return;

    onSubmit({
      title: trimmedTitle,
      startsAt: startsAt.toISOString(),
      locationName,
      locationUrl,
      capacity,
    });
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-2">
        <Icon name="create-outline" size={24} color="black" />
        <Input value={title} placeholder="제목" onChangeText={setTitle} className="flex-1" />
      </View>

      <View className="flex-row items-center gap-2">
        <Icon name="calendar-outline" size={24} color="black" />
        <DateTimePickerInput date={date} onConfirm={setDate} className="flex-1" />
      </View>

      <View className="flex-row items-center gap-2">
        <Icon name="time-outline" size={24} color="black" />
        <DateTimePickerInput mode="time" date={time} onConfirm={setTime} className="flex-1" />
      </View>

      <View className="flex-row items-center gap-2">
        <Icon name="location-outline" size={24} color="black" />
        <Input value={locationName} placeholder="장소" className="flex-1" editable={false} />
        <Button title={locationName ? '위치 변경' : '위치 추가'} onPress={onPressPickLocation} />
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-2">
          <Icon name="people-outline" size={24} color="black" />
          <Text className="text-xl">정원 (2명 이상)</Text>
        </View>

        <Input
          value={String(capacity)}
          maxLength={3}
          keyboardType="number-pad"
          onChangeText={(text) => setCapacity(Number(text))}
          className="flex-1"
        />
      </View>

      <Button title={submitLabel} isLoading={isSubmitting} onPress={handleSubmit} />
    </View>
  );
}
