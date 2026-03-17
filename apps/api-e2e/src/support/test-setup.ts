/* eslint-disable */

import axios from 'axios';

// Configure axios for tests to use.
const host = process.env.HOST ?? 'localhost';
const port = process.env.API_PORT ?? process.env.PORT ?? '3002';
axios.defaults.baseURL = `http://${host}:${port}`;

// Do not throw AxiosError on non-2xx responses. Assertions should be made via res.status.
axios.defaults.validateStatus = () => true;
