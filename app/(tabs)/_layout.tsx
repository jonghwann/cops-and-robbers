import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <NativeTabs
      labelStyle={{ color: 'black' }}
      tintColor="black"
      backgroundColor="white"
      indicatorColor="white"
    >
      <NativeTabs.Trigger name="index">
        <Label>홈</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />,
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="my-meetings">
        <Label>내 모임</Label>
        {Platform.select({
          ios: <Icon sf="list.bullet" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="list" />} />,
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved-meetings">
        <Label>찜</Label>
        {Platform.select({
          ios: <Icon sf="heart.fill" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="favorite" />} />,
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>프로필</Label>
        {Platform.select({
          ios: <Icon sf="person.crop.circle.fill" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="person" />} />,
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
