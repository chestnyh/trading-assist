/* eslint-disable */

import axios from 'axios';
import { ServicesConfigs } from '@trading-bot/configs';

// Configure axios for tests to use.
const cfg = new ServicesConfigs();
const host = cfg.getApiHost();
const port = cfg.getApiPort();
axios.defaults.baseURL = `http://${host}:${port}`;

// Do not throw AxiosError on non-2xx responses. Assertions should be made via res.status.
axios.defaults.validateStatus = () => true;
