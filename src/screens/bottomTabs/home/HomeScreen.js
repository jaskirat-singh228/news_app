import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Live from '../live/Live';
import News from './News';
import Video from '../Video';
import Profile from '../Profile';
import UserData from '../../../common/UserData';
import Chat from '../chat/Chat';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    const { userData } = UserData();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: Platform.OS === 'android' ? 70 : 95,
                },
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 17,
                    fontWeight: '600'
                }
            }}
        >
            <Tab.Screen
                name="News"
                component={News}
                options={{
                    tabBarIcon: ({ focused }) =>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../assets/images/news.png')} />
                }} />
            <Tab.Screen
                name="Videos"
                component={Video}
                options={{
                    tabBarIcon: ({ focused }) =>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../assets/images/videos.png')} />
                }} />
            <Tab.Screen
                name="Live"
                component={Live}
                options={{
                    tabBarIcon: ({ focused }) =>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../assets/images/live.png')}
                        />,
                }} />
            <Tab.Screen
                name="Chats"
                component={Chat}
                options={{
                    tabBarIcon: ({ focused }) =>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../assets/images/chat.png')}
                        />,
                }} />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: () =>
                        <Image
                            style={[styles.imageStyle, { borderRadius: 200 }]}
                            source={{ uri: userData?.image == null ? "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg" : userData?.image }}
                            resizeMode='cover'
                        />
                }} />
        </Tab.Navigator>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    imageStyle: { height: 32, width: 32 }
})