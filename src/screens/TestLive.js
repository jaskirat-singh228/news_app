import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, PermissionsAndroid, Platform, Image, TouchableOpacity, Button, TextInput, Dimensions, Keyboard } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, RtcSurfaceView, AudienceLatencyLevelType } from 'react-native-agora';

const { width, height } = Dimensions.get('window');

const appId = '8a56585effee4a75933cfeaf521cc0fd';
// const token = '007eJxTYNC7ujbYNn2Nv0sc17M0xtWzFCcGJy1eP6v0UwPDrAQ1nnQFBotEUzNTC9PUtLTUVJNEc1NLY+PktNTENFMjw+Rkg7SUT3s00hsCGRluzJRnZWSAQBCfgyEnsyw1L7W8mIEBAGJkIGs='
// const channelName = 'livenews';
const uid = 0;

const TestLive = () => {
    const navigation = useNavigation();
    const focus = useIsFocused();
    const route = useRoute();
    const agoraEngineRef = useRef(null);
    const [isJoined, setIsJoined] = useState(false);
    const isHost = route.params.isHost
    const [remoteUid, setRemoteUid] = useState(0);
    const [message, setMessage] = useState('');
    const eventHandler = useRef(null);
    const userData = route.params.userData || {}
    const [liveId, setLiveId] = useState('');
    const [mute, setMute] = useState(false);
    const liveUsers = route.params.liveUsers;
    const [chating, setChating] = useState(false);
    const [chatText, setChatText] = useState('');
    const textInputRef = useRef(null);
    const token = route.params.token;
    const channelName = route.params.channelName;

    const saveInDb = async () => {
        try {
            const liveRef = await firestore().collection('Live').add({
                token: token,
                appId: appId,
                channelName: channelName,
                userName: userData?.name || "",
                userEmail: userData?.email || "",
                userImage: userData?.image || "",
                userUid: userData.uid
            })
            console.log(liveRef.id, 'liveid');
            setLiveId(liveRef.id)
            liveRef.update({ liveId: liveRef.id });
            console.log('Live stored successfully!');
        } catch (error) {
            console.log('Live error:', error.message);
        }
    }

    useEffect(() => {
        setupVideoSDKEngine();
        return () => {
            if (agoraEngineRef.current) {
                agoraEngineRef.current.unregisterEventHandler(eventHandler.current);
                agoraEngineRef.current.release();
            }
        };
    }, [focus]);

    const setupVideoSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') {
                await getPermission();
            }
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            eventHandler.current = {
                onJoinChannelSuccess: () => {
                    showMessage('Successfully joined channel: ' + channelName);
                    setIsJoined(true);
                    if (isHost) {
                        saveInDb();
                    }
                },
                onUserJoined: (_connection, uid) => {
                    showMessage('Remote user ' + uid + ' joined');
                    setRemoteUid(uid);
                },
                onUserOffline: (_connection, uid) => {
                    showMessage('Remote user ' + uid + ' left the channel');
                    setRemoteUid(0);
                    navigation.goBack();
                },
            };
            agoraEngine.registerEventHandler(eventHandler.current);
            agoraEngine.initialize({
                appId: appId,
            });
            agoraEngine.enableVideo();
            join();
        } catch (e) {
            console.log(e);
        }
    };

    const join = async () => {
        if (isJoined) {
            return;
        }
        try {
            if (isHost) {
                // Start preview
                agoraEngineRef.current.startPreview();
                // Join the channel as a broadcaster
                agoraEngineRef.current.joinChannel(token, channelName, uid, {
                    // Set channel profile to live broadcast
                    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
                    // Set user role to broadcaster
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                    // Publish audio collected by the microphone
                    publishMicrophoneTrack: true,
                    // Publish video collected by the camera
                    publishCameraTrack: true,
                    // Automatically subscribe to all audio streams
                    autoSubscribeAudio: true,
                    // Automatically subscribe to all video streams
                    autoSubscribeVideo: true,

                });
            } else {
                // Join the channel as an audience
                agoraEngineRef.current.joinChannel(token, channelName, uid, {
                    // Set channel profile to live broadcast
                    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
                    // Set user role to audience
                    clientRoleType: ClientRoleType.ClientRoleAudience,
                    // Do not publish audio collected by the microphone
                    publishMicrophoneTrack: false,
                    // Do not publish video collected by the camera
                    publishCameraTrack: false,
                    // Automatically subscribe to all audio streams
                    autoSubscribeAudio: true,
                    // Automatically subscribe to all video streams
                    autoSubscribeVideo: true,
                    // Change the delay level of the audience to achieve fast live broadcast
                    audienceLatencyLevel: AudienceLatencyLevelType.AudienceLatencyLevelLowLatency,
                });
            }

        } catch (e) {
            console.log('Joining Error: ', e);
        }
    };

    const leave = () => {
        try {
            if (agoraEngineRef.current) {
                agoraEngineRef.current.leaveChannel();
            }
            setRemoteUid(0);
            setIsJoined(false);
            showMessage('Left the channel');
            navigation.goBack();
            if (isHost) {
                firestore().collection('Live').doc(liveId).delete()
            }
        } catch (e) {
            console.log('Leaving Error: ', e);
        }
    };

    const handleSwitchCamera = async () => {
        if (agoraEngineRef.current) {
            agoraEngineRef.current.switchCamera();
        }
    };

    const handleMute = async () => {
        if (agoraEngineRef.current) {
            agoraEngineRef.current.muteLocalAudioStream(!mute);
            setMute(!mute);
        }
    };

    const handleChat = () => {
        setChating(true)
        setTimeout(() => {
            textInputRef.current.focus();
        }, 0);
    }

    useEffect(() => {
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setChating(false);
        });
        return () => {
            keyboardHideListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <View style={styles.profilHeader}>
                    <View style={{ justifyContent: 'center', flexDirection: 'row', zIndex: 1000 }}>
                        <Image
                            source={{
                                uri: isHost ? (userData?.image && userData.image.trim() !== '' ? userData?.image : 'https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg')
                                    : (liveUsers?.userImage && liveUsers.userImage.trim() !== '' ? liveUsers?.userImage : 'https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg')
                            }}
                            style={styles.profileImage}
                            resizeMode='cover'
                        />
                        <View style={{ justifyContent: 'center', marginLeft: 8 }}>
                            <Text style={styles.userName}>{isHost ? userData?.name : liveUsers?.userName}</Text>
                            <Text style={styles.userName}>{isHost ? userData?.uid : liveUsers?.userUid}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={leave} style={styles.leave}>
                        <Image style={{ height: 12, width: 12, }} source={require('../assets/images/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    {isJoined && isHost && (
                        <React.Fragment key={0}>
                            {/* Create a local view using RtcSurfaceView */}
                            <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
                        </React.Fragment>
                    )}
                    {isJoined && remoteUid !== 0 && (
                        <React.Fragment key={remoteUid}>
                            {/* Create a remote view using RtcSurfaceView */}
                            <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />
                        </React.Fragment>
                    )}
                    <Text style={styles.info}>{message}</Text>
                </View>
            </View>
            <View style={styles.bottomBar}>
                <View style={{ flexDirection: 'row', height: 60, alignItems: 'flex-end', }}>
                    {!chating ?
                        <TouchableOpacity onPress={() => handleChat()} style={styles.bottomBarButtons}>
                            <Image source={require('../assets/images/liveChat.png')} style={styles.muteIcon} />
                        </TouchableOpacity>
                        : <View style={styles.textInputView}>
                            <TextInput
                                ref={textInputRef}
                                value={chatText}
                                onChangeText={(text) => setChatText(text)}
                                placeholder='Enter a text'
                                placeholderTextColor={'white'}
                                style={styles.textInput}
                            />
                            <TouchableOpacity onPress={() => setChatText('')} style={styles.sendButton}>
                                <Image source={require('../assets/images/send.png')} style={{ tintColor: 'white' }} />
                            </TouchableOpacity>
                        </View>
                    }
                    {!chating ? isHost &&
                        (<TouchableOpacity onPress={handleSwitchCamera} style={styles.bottomBarButtons}>
                            <Image source={require('../assets/images/switch.png')} style={[styles.muteIcon, { marginHorizontal: 20 }]} />
                        </TouchableOpacity>)
                        : null}
                    {!chating ? mute ?
                        (<TouchableOpacity onPress={handleMute} style={styles.bottomBarButtons}>
                            <Image source={require('../assets/images/mute.png')} style={styles.muteIcon} />
                        </TouchableOpacity >) :
                        (<TouchableOpacity onPress={handleMute} style={styles.bottomBarButtons}>
                            <Image source={require('../assets/images/unmute.png')} style={styles.muteIcon} />
                        </TouchableOpacity>)
                        : null}
                </View>
            </View>
        </SafeAreaView>
    );

    function showMessage(msg) {
        setMessage(msg);
    }
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    profilHeader: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 5, width: '92%', alignSelf: 'center', zIndex: 10000 },
    profileImage: { height: 45, width: 45, borderRadius: 200, borderWidth: 0.5, borderColor: 'gray' },
    userName: { fontSize: 16, fontWeight: '600', color: 'black' },
    leave: { justifyContent: 'center', backgroundColor: 'white', borderRadius: 200, height: 30, width: 30, alignItems: 'center' },
    videoView: { width: '100%', height: '100%', zIndex: 1000 },
    info: { backgroundColor: '#ffffe0', padding: 3, color: '#0000ff', position: 'absolute', alignSelf: 'center', bottom: 100 },
    bottomBar: Platform.OS == 'android' ? { flexDirection: 'row', alignSelf: 'center', position: 'absolute', bottom: 5, zIndex: 1000, width: '95%', justifyContent: 'center' } : { flexDirection: 'row', marginHorizontal: 15, position: 'absolute', bottom: 40, zIndex: 1000, alignSelf: 'center', width: '95%', justifyContent: 'center' },
    muteIcon: { height: 30, width: 30, tintColor: 'white' },
    bottomBarButtons: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 200, margin: 5, height: 60, width: 60, alignItems: 'center', justifyContent: 'center', zIndex: 3000 },
    textInput: { color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', height: 50, width: '85%', alignItems: 'center', justifyContent: 'center', fontSize: 16, padding: 10 },
    sendButton: { width: '10%', height: 50, justifyContent: 'center', padding: 5 },
    textInputView: { backgroundColor: 'rgba(0,0,0,0.3)', height: 70, width: width, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }
});

const getPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
    }
};

export default TestLive;
