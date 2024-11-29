import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import UserData from '../../../common/UserData';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Message = () => {
    const focus = useIsFocused();
    const navigation = useNavigation();
    const route = useRoute();
    const users = route.params?.users
    const receiverUid = route.params?.userUid
    const textInputRef = useRef(null);
    const [chatText, setChatText] = useState('');
    const [messages, setMessages] = useState([]);
    const { userData } = UserData();

    const chatId = [userData?.uid, receiverUid].sort().join('__');

    useEffect(() => {
        // for new messages 
        const unsubscribe = firestore().collection('Chats').doc(chatId).collection('Messages').orderBy('timestamp', 'asc')
            .onSnapshot(querySnapshot => {
                const allMessages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(allMessages);
            });
        return unsubscribe;
    }, [focus, messages]);

    const handleChat = () => {
        setTimeout(() => {
            textInputRef.current.focus();
        }, 0);
    }

    const sendMsg = async (content, isImage = false) => {
        if ((chatText.trim() !== '')&& userData?.uid && receiverUid) {
            try {
                await firestore().collection('Chats').doc(chatId).collection('Messages')
                    .add({
                        senderUid: userData?.uid,
                        receiverUid: receiverUid,
                        timestamp: firestore.FieldValue.serverTimestamp(),
                        message: chatText,
                    });
                console.log('Message sent successfully:');
                setChatText('');
            } catch (error) {
                console.log('Message could not be sent:', error);
            }
        }

        if ((isImage || content.trim() !== '') && userData?.uid && receiverUid) {
            try {
                await firestore().collection('Chats').doc(chatId).collection('Messages')
                    .add({
                        senderUid: userData?.uid,
                        receiverUid: receiverUid,
                        timestamp: firestore.FieldValue.serverTimestamp(),
                        message: isImage ? null : content,
                        imageUrl: isImage ? content : null, 
                    });
                console.log('Message sent successfully');
                setChatText('');
            } catch (error) {
                console.log('Message could not be sent:', error);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1E201E' }}>
            <View style={styles.header} />
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Image source={require('../../../assets/images/back.png')} style={styles.userImage} />
                    <Image source={{ uri: users?.image && users.image.trim() !== '' ? users.image : "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg" }} style={{ height: 40, width: 40, borderRadius: 200 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', width: '45%' }}>
                    <Text numberOfLines={1} style={styles.userName}>{users.name}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', width: '20%', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.calling}>
                        <Image source={require('../../../assets/images/videoCall.png')} style={[styles.callingImage, { height: 20, width: 30 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.calling}>
                        <Image source={require('../../../assets/images/voiceCall.png')} style={styles.callingImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.calling}>
                        <Image source={require('../../../assets/images/dots.png')} style={styles.callingImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, padding: 10 }}>
                {messages.filter(msg => typeof msg.message == 'string' && msg.message.trim() !== '').map((msg) => (
                    <View key={msg.id} style={msg.senderUid == userData?.uid ? styles.sentMessage : styles.receivedMessage}>
                        {msg.imageUrl ? (
                            <Image source={{ uri: msg.imageUrl }} style={{ width: 200, height: 200, borderRadius: 8 }} />
                        ) : (
                            <Text style={{ color: 'white' }}>{msg.message}</Text>
                        )}
                        <Text style={{ color: 'white', alignSelf: 'flex-end' }}>{msg.timestamp}</Text>
                    </View>
                ))}
            </View>
            <View style={{ flexDirection: 'row', height: 60, alignItems: 'flex-end', }}>
                <View style={styles.textInputView}>
                    <TouchableOpacity onPress={handleChat} style={{ height: 50, width: '85%', zIndex: 1000 }}>
                        <TextInput
                            ref={textInputRef}
                            value={chatText}
                            onChangeText={(text) => setChatText(text)}
                            placeholder='Message'
                            placeholderTextColor={'white'}
                            style={styles.textInput}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={sendMsg} style={styles.sendButton}>
                        <Image source={require('../../../assets/images/send.png')} style={{ tintColor: 'white' }} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Message

const styles = StyleSheet.create({
    header: { height: 62, backgroundColor: '#1E201E', position: 'absolute', width: '100%' },
    chatHeader: { height: 55, backgroundColor: '#1E201E', width: '100%', flexDirection: 'row', borderBottomWidth: 0.2, borderColor: 'lightgray' },
    userName: { color: 'white', fontSize: 17, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 14, },
    userImage: { tintColor: 'white', margin: 8, height: 25, width: 25 },
    calling: { height: 55, width: '60%', alignItems: 'center', justifyContent: "center" },
    callingImage: { tintColor: 'white', height: 25, width: 25 },
    textInput: { color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', height: 50, alignItems: 'center', justifyContent: 'center', fontSize: 16, padding: 10, borderRadius: 10 },
    sendButton: { width: '10%', height: 50, justifyContent: 'center', padding: 5 },
    textInputView: { backgroundColor: 'rgba(0,0,0,0.3)', height: 70, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', zIndex: 1000, width: '100%' },
    sentMessage: { alignSelf: 'flex-end', backgroundColor: '#1D72F3', padding: 10, borderRadius: 8, marginVertical: 5 },
    receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#444', padding: 10, borderRadius: 8, marginVertical: 5 },
})