import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'

export default AllUsersData = () => {
    const [users, setUsers] = useState(null)
    const focus = useIsFocused();

    useEffect(() => {
        const subscriber = firestore()
            .collection('Users')
            .onSnapshot(querySnapshot => {
                const users = [];
                querySnapshot.forEach((documentSnapshot, index) => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setUsers(users);
                // console.log(users, "Users data");
            });
        return () => subscriber();
    }, [focus]);

    return { users }
}