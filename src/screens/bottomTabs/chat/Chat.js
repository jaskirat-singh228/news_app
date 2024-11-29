import { FlatList, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import AllUsersData from '../../../common/AllUsersData';
import { useNavigation } from '@react-navigation/native';
import UserData from '../../../common/UserData';


const Chat = () => {
    const navigation = useNavigation();
    const { users } = AllUsersData();
    const { uid } = UserData();

    const handleMsg = (index) => {
        navigation.navigate('Message', { users: users[index], userUid: users[index]?.uid })
    }

    const renderUsers = ({ item, index }) => {
        return (
            item.uid != uid ?
                <View style={styles.viewStyle}>
                    <View style={{ flex: 0.15 }}>
                        <Image style={{ height: 50, width: 50, borderRadius: 200 }} source={{ uri: item?.image && item.image.trim() !== '' ? item.image : "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg" }} />
                    </View>
                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: Platform.OS == 'android' ? 10 : 0 }}>
                            <Text numberOfLines={1} style={styles.textStyle}>Name: {item.name}</Text>
                            <Text numberOfLines={1} style={styles.textStyle}>Email: {item.email}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleMsg(index)}
                            style={styles.followButton}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header} />
            <View style={styles.chatView}>
                <Text style={styles.chat}>Chats</Text>
            </View>
            <FlatList
                data={users}
                renderItem={renderUsers}
            />
        </SafeAreaView>
    )
}

export default Chat

const styles = StyleSheet.create({
    header: { height: 62, backgroundColor: '#1E201E', position: 'absolute', width: '100%' },
    chatView: { backgroundColor: '#1E201E', flexDirection: 'row', justifyContent: 'space-between' },
    chat: { fontSize: 30, fontWeight: '700', padding: 10, color: 'white', alignSelf: 'flex-start', },
    viewStyle: { width: '96%', justifyContent: 'center', alignSelf: 'center', marginTop: 10, padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)' },
    textStyle: { fontSize: 20, fontWeight: '600', marginTop: 3 },
    followButton: { backgroundColor: '#4CC9FE', alignSelf: 'center', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10, alignItems: 'center' }
})