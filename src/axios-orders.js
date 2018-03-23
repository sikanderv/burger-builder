import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-ed455.firebaseio.com/'
});

export default instance;