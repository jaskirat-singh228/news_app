import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import ImageResizer from '@bam.tech/react-native-image-resizer';
import UserData from '../../common/UserData';

const ProfileScreen = () => {
    const { userData, uid } = UserData();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [updateImage, setUpdateImage] = useState(false);

    useEffect(() => {
    }, [updateImage])

    const handleLogOut = () => {
        setLoading(true)
        auth().signOut()
            .then(() => {
                console.log('Signed Out!');
                navigation.navigate('LoginScreen');
            })
            .catch(error => {
                Alert.alert('Error', error)
                console.error('Error:>>>>>>>', error);
            }).finally(() => {
                setLoading(false)
            })
    }

    const onPressPlus = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(async image => {
            console.log('Image Path:', image.path);
            // Upload image to Firebase Storage
            const downloadURL = await uploadImageToStorage(image.path);
            updateData(downloadURL);
            setUpdateImage(true)
        }).catch(error => {
            console.log("Image Picker Error:", error);
        });
    };

    const updateData = async (downloadURL) => {
        await firestore().collection('Users').doc(uid).update({
            image: downloadURL
        })
    }

    const uploadImageToStorage = async (imagePath) => {
        const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
        const storageRef = storage().ref(fileName);
        try {
            const resizedImage = await ImageResizer.createResizedImage(
                imagePath, //path 
                800, //width
                600, //height
                'JPEG' || 'PNG' || 'WEBP', // Compress format
                20, // "quality" (0-100)
                0, // "rotation" angle (in degrees)
                null, // optional "output" path to save the resized image
            );
            console.log('Resized Image:', resizedImage)
            await storageRef.putFile(resizedImage.uri);
            const url = await storageRef.getDownloadURL();
            console.log('Image uploaded on firebase storage successfully:', url);
            Alert.alert('Success', 'Image uploaded successfully');
            return url;
        } catch (error) {
            console.log('Error uploading image:', error);
            throw error;
        } finally {
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={onPressPlus}
                style={[{ alignSelf: 'center', marginTop: 50 }]}>
                <Image resizeMode='cover' source={{ uri: userData?.image == null ? "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg" : userData?.image }}
                    style={styles.profileImage} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={styles.userName}>User Name: </Text>
                <Text style={styles.userName}>{userData?.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={styles.userId}>User Id: </Text>
                <Text style={styles.userId}>{uid}</Text>
            </View>
            {loading ?
                (<ActivityIndicator style={{ marginTop: 50 }} color='blue' size='large' />)
                : (<TouchableOpacity style={styles.logOutButton} onPress={() => handleLogOut()}>
                    <Text style={styles.logOutText}>Log Out</Text>
                </TouchableOpacity>)
            }
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    logOutButton: { alignSelf: 'center', marginVertical: 35, backgroundColor: 'skyblue', padding: 15, width: '90%', alignItems: 'center', justifyContent: 'center', borderRadius: 200, },
    userId: { alignSelf: 'center', fontSize: 19, fontWeight: '600', marginTop: 8, color: 'black' },
    logOutText: { fontSize: 25, fontWeight: '600', color: 'black' },
    profileImage: { width: 120, height: 120, borderRadius: 400, borderColor: 'lightgray', borderWidth: 3, padding: 10 },
    userName: { alignSelf: 'center', fontSize: 20, fontWeight: '600', marginTop: 8, color: 'black' }
})