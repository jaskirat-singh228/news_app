import axios from 'axios';

const API_KEY = '625cda64d1ec4444ae4c155c99f19843';
const BASE_URL = 'https://newsapi.org/v2/';

const getNews = async (category) => {
    try {
        const categoryParam = category ? `&category=${category}` : '';
        const response = await axios.get(`${BASE_URL}top-headlines?country=us${categoryParam}&apiKey=${API_KEY}`);
        return response.data.articles;
    } catch (error) {
        console.error("Error fetching news", error);
    }
};

export default { getNews };
