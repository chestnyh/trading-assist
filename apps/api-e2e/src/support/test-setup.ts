/* eslint-disable */

import axios from 'axios';
import { ServicesConfigs } from '@trading-bot/configs';

// Configure axios for tests to use.
const cfg = new ServicesConfigs();
const apiHost = cfg.getRequired('API_HOST');
const apiPort = cfg.getRequired('API_PORT');
const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(apiHost);
const base = new URL(hasScheme ? apiHost : `http://${apiHost}`);
if (!base.port) {
  base.port = apiPort;
}
axios.defaults.baseURL = base.toString().replace(/\/$/, '');

// Do not throw AxiosError on non-2xx responses. Assertions should be made via res.status.
axios.defaults.validateStatus = () => true;
