import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import UserData from '../../../common/UserData';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Live = () => {
  const focus = useIsFocused();
  const { userData, uid } = UserData();
  const navigation = useNavigation();
  const [liveUsers, setLiveUsers] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Live')
      .onSnapshot(querySnapshot => {
        const users = [];
        querySnapshot.forEach((documentSnapshot, index) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setLiveUsers(users);
        console.log(users, "Live users data");
      });
    return () => subscriber();
  }, [focus]);

  const hanleLiveUsers = (item) => {
    navigation.navigate('TestLive', { liveUsers: item, isHost: false, })
  }

  const renderLiveUsers = (item) => {
    return (
      <TouchableOpacity
        onPress={() => hanleLiveUsers(item)}
        style={styles.liveUsers}>
        <Image
          source={{ uri: item.image != null ? item.image : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png' }}
          resizeMode='stretch'
          style={{ height: '100%', width: '100%' }}
        />
        <Text style={styles.audioOrVideoText}>{item?.status}Video</Text>
        <Text style={styles.userLiveText}>{item?.userName} is live</Text>
      </TouchableOpacity>
    )
  }

  const randomChannelName = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomWord = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomWord += letters[randomIndex];
    }
    // console.log(randomWord, '<<<<<< randomChannelName');
    return randomWord;
  }

  const getToken = async () => {
    const channelName = randomChannelName();
    // console.log(channelName);
    try {
      const response = await axios.post('http://192.168.1.111:3000/generate-token', {
        channelName: channelName,
        uid: uid,
        role: "publisher",
      })
      // console.log("Token:", response.data.token);
      // console.log({ userData: userData, isHost: true, token: response.data.token, channelName: channelName }, '<<<<<<<< tyrtyetyetyety');
      // return
      if (response.data.token != null || response.data.token != '' || response.data.token != undefined) {
        navigation.navigate('TestLive', { userData: userData, isHost: true, token: response.data.token, channelName: channelName })
      }
    } catch (error) {
      console.log("Error fetching token:", error.message); // Log the error message
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else if (error.request) {
        console.log("Request data:", JSON.stringify(error.request));
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  // const goLive = async () => {
  //   try {
  //     const response = await axios.post('http://192.168.1.111:3000/generate-token', {
  //       channelName: 'sfvsfv',
  //       uid: 'fsvsv',
  //       role: "publisher",
  //     })
  //     console.log("Token:", response.data.token);
  //   } catch (error) {
  //     console.log("Error fetching token:", error);
  //   }
  // }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header} />
      <View style={styles.liveView}>
        <Text style={styles.live}>Live</Text>
        <View style={{ paddingHorizontal: 5 }}>
          <TouchableOpacity
            onPress={() => getToken()}>
            <Image source={require('../../../assets/images/goLive.png')} style={styles.liveIcon} />
            <Text style={styles.goLive}>Go live</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={liveUsers}
        numColumns={2}
        keyExtractor={index => index.toString()}
        renderItem={({ item }) => renderLiveUsers(item)}
      />
    </SafeAreaView>
  );
};

// Define user interface styles
const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  header: { height: 62, backgroundColor: '#1E201E', position: 'absolute', width: width },
  liveView: { backgroundColor: '#1E201E', flexDirection: 'row', justifyContent: 'space-between' },
  button: { padding: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#0055cc', margin: 5, fontSize: 20, },
  live: { fontSize: 30, fontWeight: '700', padding: 10, color: 'red', alignSelf: 'flex-start', },
  goLive: { color: 'red', fontSize: 13, fontWeight: '500', marginRight: 5 },
  liveIcon: { tintColor: 'red', height: 30, width: 30, marginLeft: 6 },
  liveUsers: { marginVertical: 5, marginHorizontal: 5, alignSelf: 'center', height: 120, width: '47.5%' },
  audioOrVideoText: { position: 'absolute', top: 5, fontSize: 15, fontWeight: '500', left: 5, color: 'white', zIndex: 100, backgroundColor: 'green', paddingHorizontal: 3 },
  userLiveText: { position: 'absolute', bottom: 5, fontSize: 16, fontWeight: '600', left: 5, color: 'black', zIndex: 100 },
  btnContainer: { justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  head: { fontSize: 25, alignSelf: 'flex-end', fontWeight: '600', margin: 5, backgroundColor: 'red', paddingVertical: 5, paddingHorizontal: 8, color: 'white' },
  host: { fontSize: 20, marginHorizontal: 10, color: 'black' },
  textInputStyle: { borderWidth: 1, borderRadius: 10, height: 60, width: '90%', padding: 5, fontSize: 20, alignSelf: 'center', marginVertical: 5, color: 'black' }
});

export default Live;
