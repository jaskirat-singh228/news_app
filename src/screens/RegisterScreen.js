import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../common/Header';

const RegisterScreen = () => {

    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setDisabled(!name || !email || !password || !phone);
    }, [name, email, password, phone]);


    const handleRegister = async () => {
        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;
            console.log(userCredential.user.uid, '<<<<<<<<< uid');
            console.log(uid, '<<<<<<<<< userId');
            storeUid(userCredential.user.uid)

            await firestore().collection('Users').doc(uid).set({
                uid: uid,
                name,
                email,
                password,
                phone,
            });
            navigation.navigate('HomeScreen');
            console.log('User stored successfully!');
        } catch (error) {
            Alert.alert('Error creating user:', error)
            console.error('Error creating user:', error);
        } finally {
            setName('')
            setEmail('')
            setPassword('')
            setPhone('')
            setLoading(false);
        }
    };

    const storeUid = async (value) => {
        try {
            await AsyncStorage.setItem('uid', value);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <Header />
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                <Image source={require('../assets/images/back.png')} />
            </TouchableOpacity>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.textInputStyle}
                placeholder="Enter name"
                placeholderTextColor={'gray'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder="Email"
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder="Enter password"
                placeholderTextColor={'gray'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder="Enter phone number"
                placeholderTextColor={'gray'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            {loading ? (
                <ActivityIndicator style={{ marginTop: 50, marginVertical: 20, }} size="large" color="blue" />
            ) : (
                <TouchableOpacity
                    disabled={disabled}
                    style={[styles.registerButton, { backgroundColor: disabled ? 'gray' : 'skyblue' }]}
                    onPress={handleRegister}
                >
                    <Text style={{ fontSize: 25, fontWeight: '600',color:'black' }}>Register</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: { fontSize: 30, marginVertical: 50, textAlign: 'center', fontWeight: '800', color: 'black' },
    textInputStyle: { height: 60, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 8, fontSize: 20, width: '90%', alignSelf: 'center', color: 'black' },
    registerButton: { alignSelf: 'center', marginVertical: 20, backgroundColor: 'skyblue', padding: 15, width: '90%', alignItems: 'center', justifyContent: 'center', borderRadius: 200, marginTop: 50, color: 'black' },
});

export default RegisterScreen;
