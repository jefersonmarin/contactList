import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, Text, View, Alert, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import Ionicons from '@expo/vector-icons/Ionicons';

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
	const dirInfo = await FileSystem.getInfoAsync(imgDir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
	}
};

export default function App() {

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    await ensureDirExists()
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if(files.length > 0) {
      setImages(files.map(f => imgDir + f));
    }
  }

  const selectImage = async (useLibrary: boolean) => {
      let result;
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
      };

      if (useLibrary) {
        result = await ImagePicker.launchImageLibraryAsync(options);
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync(options);
      }

      if (!result.canceled) {
        saveImage(result.assets[0].uri)
      }
  };

  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const filename = new Date().getTime() + '.jpg';
    const dest = imgDir + filename;
    await FileSystem.copyAsync({from: uri, to: dest});
    setImages([...images, dest]);
  };

  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);

    try {
      await FileSystem.uploadAsync('http://172.17.172.140:8080/upload.php', uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
      });
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading the image.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const filename = item.split('/').pop();
    return (
      <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
        <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
        <Text style={{ flex: 1 }}>{filename}</Text>
        <Ionicons.Button name="cloud-upload" onPress={() =>uploadImage(item)} />
        <Ionicons.Button name="trash" onPress={() =>deleteImage(item)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", marginTop: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20 }}>
        <Button title="Photo Library" onPress={() => selectImage(true)} />
        <Button title="Capture Image" onPress={() => selectImage(false)} />
      </View>

      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500' }}>My Images</Text>
      <FlatList data={images} renderItem={renderItem} />

      {loading && (
			<View
				style={[
					StyleSheet.absoluteFill,
					{
						backgroundColor: 'rgba(0,0,0,0.4)',
						alignItems: 'center',
						justifyContent: 'center'
					}
				]}
			>
        <ActivityIndicator color="#fff" animating size="large" />
			</View>
		)}

	</SafeAreaView>
  );
}

