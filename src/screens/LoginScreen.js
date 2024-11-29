import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const storeUid = async (value) => {
        try {
            await AsyncStorage.setItem('uid', value);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                // console.log(JSON.stringify(res));
                console.log('Signed in successfully!');
                storeUid(res.user.uid)
                console.log('userId', res.user.uid);
                navigation.navigate('HomeScreen');
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/user-not-found') {
                    Alert.alert('Error', 'No user found with this email.');
                } else if (error.code === 'auth/wrong-password') {
                    Alert.alert('Error', 'Incorrect password.');
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error', 'Invalid email address.');
                } else {
                    Alert.alert('Error', error.message);
                    console.log('Error', error.message);

                }
            })
            .finally(() => {
                setEmail('');
                setPassword('');
                setLoading(false);
            });
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.emailText}>Email</Text>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="Email"
                    placeholderTextColor={'gray'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="Enter email"
                    autoCapitalize="none"
                />
                <Text style={styles.emailText}>Password</Text>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="Enter password"
                    placeholderTextColor={'gray'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={{ alignSelf: 'flex-end', marginRight: 18 }}>
                    <Button onPress={() => navigation.navigate('ForgetPassword')} title='Forget password?' />
                </View>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 50, marginVertical: 20, }} size="large" color="blue" />
                ) : (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Login</Text>
                    </TouchableOpacity>
                )}
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'black' }}>Don't have an account?</Text>
                    <Text
                        onPress={() => navigation.navigate('RegisterScreen')}
                        style={{ fontSize: 18, color: 'blue' }}> Register</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    title: { fontSize: 30, marginVertical: 70, textAlign: 'center', fontWeight: '800', color: 'black' },
    textInputStyle: { height: 60, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 8, fontSize: 20, width: '90%', alignSelf: 'center', color: 'black' },
    loginButton: { alignSelf: 'center', marginVertical: 20, backgroundColor: 'skyblue', padding: 15, width: '90%', alignItems: 'center', justifyContent: 'center', borderRadius: 200, marginTop: 50 },
    emailText: { marginLeft: 22, marginVertical: 8, fontSize: 18, color: 'black' }
});

export default LoginScreen;
