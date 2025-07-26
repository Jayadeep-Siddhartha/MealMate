import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.7:5000/api', // change this!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
