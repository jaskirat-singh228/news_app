import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore'
import { useIsFocused } from '@react-navigation/native';

export default UserData = () => {
    const [uid, setUid] = useState('');
    const [userData, setUserData] = useState(null);
    const focused = useIsFocused();

    useEffect(() => {
        getUid();
        let subscriber;
        if (uid) {
            subscriber = firestore().collection('Users').doc(uid)
                .onSnapshot(documentSnapshot => {
                    setUserData(documentSnapshot.data());
                });
        }
        return () => subscriber && subscriber();
    }, [focused, uid]);

    const getUid = async () => {
        try {
            const value = await AsyncStorage.getItem('uid');
            if (value !== null) {
                // console.log(value, '<<<<< UID');
                setUid(value)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { userData, uid };
};


