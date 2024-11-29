import { Dimensions, FlatList, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get('window');
const LiveStreaming = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const breakingNews = [
        { id: 1, videoId: 'Adh5J41Dscs' },
        { id: 2, videoId: 'gadjsB5BkK4' },
        { id: 3, videoId: 'nCuX5N3bx5Q' },
        { id: 4, videoId: '3RaOndYKZlo' },
        { id: 5, videoId: 'P857H4ej-MQ' },
        { id: 6, videoId: '8ex7PRQ4fsw' },
        { id: 7, videoId: '3RaOndYKZlo' },
        { id: 8, videoId: 'rfClnu2_u2E' },
        { id: 9, videoId: 'vZYMwAm8sso' },
        { id: 10, videoId: 'Tq8PvA8LkqE' },
    ];

    const renderBreakingNews = ({ item }) => {
        return (
            <View style={{ width: width, alignItems: 'center', height: 250 }}>
                <YoutubePlayer
                    width={'95%'}
                    height={'100%'}
                    videoId={item.videoId}
                />
            </View>

        );
    }

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });

    const viewabilityConfig = { itemVisiblePercentThreshold: 50, };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={breakingNews}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={renderBreakingNews}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewabilityConfig}
            />
             <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {breakingNews.map((item, index) => {
                            return (
                                <View key={item.id} style={{
                                    backgroundColor: currentIndex === index ? 'red' : 'gray',
                                    height: 8,
                                    width: 8,
                                    borderRadius: 20,
                                    marginLeft: 5
                                }} />
                            )
                        })
                    }
                </View>
        </SafeAreaView>
    )
}

export default LiveStreaming

const styles = StyleSheet.create({})