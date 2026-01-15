import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'recent_meetings';
const MAX = 20;

export async function addRecentMeetingId(id: string) {
  const raw = await AsyncStorage.getItem(KEY);
  const prev: string[] = raw ? JSON.parse(raw) : [];
  const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function getRecentMeetingIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearRecentMeetings() {
  await AsyncStorage.removeItem(KEY);
}
