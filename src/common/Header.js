import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window');

const Header = () => {
    return (
            <>
            <View style={{height:62,backgroundColor:'#1E201E',position:'absolute',width:width}}/>
            <View style={{backgroundColor:'#1E201E'}}>
                <Text style={styles.text}>News App</Text>
                </View>
            </>
    )
}

export default Header

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        fontWeight: '700',
        padding: 10,
        color:'#B1AFFF',
        alignSelf:'flex-start',
    },
})