import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface PickImageOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export default function useImagePicker() {
  const [image, setImage] = useState('');

  const pickImage = async (options: PickImageOptions = {}) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: options.allowsEditing ?? true,
      aspect: options.aspect ?? [4, 3],
      quality: options.quality ?? 0.9,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      return uri;
    }
  };

  return { image, setImage, pickImage };
}
