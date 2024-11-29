import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import Header from '../../common/Header';

const { width, height } = Dimensions.get('window');

const Video = () => {

  const liveNews = [
    { id: 1, videoId: 'Adh5J41Dscs' },
    { id: 2, videoId: 'gadjsB5BkK4' },
    { id: 3, videoId: 'nCuX5N3bx5Q' },
    { id: 4, videoId: '7CaeSJxMj9o' },
    { id: 5, videoId: 'P857H4ej-MQ' },
    { id: 6, videoId: '8ex7PRQ4fsw' },
    { id: 7, videoId: '3RaOndYKZlo' },
    { id: 8, videoId: 'rfClnu2_u2E' },
    { id: 9, videoId: 'vZYMwAm8sso' },
    { id: 10, videoId: 'Tq8PvA8LkqE' },
  ];

  const renderLiveNews = ({ item }) => {
    return (
      <View style={styles.main}>
        <YoutubePlayer width={'100%'} height={'100%'} videoId={item.videoId} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <FlatList
        data={liveNews}
        keyExtractor={item => item.id.toString()}
        renderItem={renderLiveNews}
      />
    </SafeAreaView>
  )
}

export default Video

const styles = StyleSheet.create({
  main: { width: width, alignItems: 'center', height: 260, padding: 10 }
})