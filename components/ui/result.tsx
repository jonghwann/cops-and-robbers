import { Text, View } from 'react-native';

interface ResultProps {
  figure: React.ReactNode;
  title: string;
  description: string;
}

export default function Result({ figure, title, description }: ResultProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-2">{figure}</View>
      <Text className="mb-1 text-2xl">{title}</Text>
      <Text className="text-center text-gray-500 text-xl">{description}</Text>
    </View>
  );
}
