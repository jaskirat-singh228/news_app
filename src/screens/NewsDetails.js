import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import WebView from 'react-native-webview';

const NewsDetails = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
        <Image source={require('../assets/images/back.png')} />
      </TouchableOpacity>
      <View style={{ backgroundColor: 'gray', height: 0.2 }} />
      <WebView
        originWhitelist={['*']}
        style={{ flex: 1 }}
        source={{ uri: url }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
};

export default NewsDetails;
