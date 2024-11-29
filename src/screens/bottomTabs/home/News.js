import { ActivityIndicator, Button, Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ApisFunctions from '../../ApisFunctions';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";
import Header from '../../../common/Header';

const { width, height } = Dimensions.get('window');

const News = () => {
    const focus = useIsFocused()
    const navigation = useNavigation();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('business');
    const [currentIndex, setCurrentIndex] = useState(0);

    const categories = [
        { id: 1, name: 'business' },
        { id: 2, name: 'general' },
        { id: 3, name: 'entertainment' },
        { id: 4, name: 'health' },
        { id: 5, name: 'technology' },
        { id: 6, name: 'sports' },
        { id: 7, name: 'science' },
    ];

    const breakingNews = [
        { id: 1, videoId: 'gadjsB5BkK4' },
        { id: 2, videoId: 'nCuX5N3bx5Q' },
        { id: 3, videoId: 'vZYMwAm8sso' },
        { id: 4, videoId: 'P857H4ej-MQ' },
        { id: 5, videoId: '8ex7PRQ4fsw' },
        { id: 6, videoId: '3RaOndYKZlo' },
        { id: 7, videoId: 'rfClnu2_u2E' },
        { id: 8, videoId: 'Tq8PvA8LkqE' },
    ];

    const fetchNews = async () => {
        setLoading(true);
        const category = selectedCategory;
        const news = await ApisFunctions.getNews(category);
        setNews(news)
        setLoading(false);
    }

    useEffect(() => {
        fetchNews();
        console.log(selectedCategory);
    }, [selectedCategory, focus]);

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });
    const viewabilityConfig = { itemVisiblePercentThreshold: 100, };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderBreakingNews = ({ item }) => {
        return (
            <View style={{ width: width, alignItems: 'center', height: 250 }}>
                <YoutubePlayer width={'95%'} height={'100%'} videoId={item.videoId} />
            </View>
        );
    }

    const renderNews = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('NewsDetails', { url: item.url })}>
                <View style={styles.newsView}>
                    {item.urlToImage && (
                        <Image source={{ uri: item.urlToImage }} style={{ width: '100%', height: 200, borderRadius: 8, }} />
                    )}
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const renderHeader = () => {
        return (
            <>
                <View style={styles.breakingNewsView}>
                    <Text style={styles.breakingNewsText}>Breaking News</Text>
                </View>
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
                        return (<View key={item.id} style={[styles.categoryButtonsView, { backgroundColor: currentIndex === index ? 'red' : 'gray' }]} />)
                    })}
                </View>
                <Text style={[styles.breakingNewsText, { color: 'black', alignSelf: 'flex-start' }]}>Categories</Text>
                <View style={{ marginVertical: 10 }}>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(item.name)}
                                    style={[styles.categoryButtons, { backgroundColor: selectedCategory === item.name ? '#EEEEEE' : null }]}>
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'darkgray' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <View style={[styles.breakingNewsView, { backgroundColor: '#4CC9FE', }]}>
                    <Text style={styles.breakingNewsText}>{selectedCategory.charAt(0).toUpperCase()}{selectedCategory.slice(1)} News</Text>
                </View>
            </>
        )
    }

    return (
        <SafeAreaView style={styles.main}>
            <Header />
            <FlatList
                data={news}
                keyExtractor={(item, index) => `${item.url}-${index}`}
                ListHeaderComponent={renderHeader}
                renderItem={renderNews}
            />
        </SafeAreaView>
    );
}

export default News;

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, },
    newsView: { marginBottom: 20, backgroundColor: '#F1F1F1', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 10 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    categoryButtons: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 200, borderWidth: 1, borderColor: 'lightgray', marginLeft: 10 },
    breakingNewsText: { fontSize: 27, fontWeight: '700', padding: 6, color: 'white', paddingHorizontal: 10, },
    title: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: 'black' },
    description: { fontSize: 14, color: '#555', marginTop: 5 },
    categoryButtonsView: { height: 8, width: 8, borderRadius: 20, marginLeft: 5 },
    breakingNewsView: { borderRadius: 10, backgroundColor: 'red', margin: 10, alignSelf: 'flex-start' },
});
