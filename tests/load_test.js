// use `k6 run xx.js` to execute this test

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'], // less than 1% of requests should fail
    },
};


export default function () {
    const BASE_URL = 'http://localhost:3000';

    let resCSR = http.get(`${BASE_URL}/csr`);
    let resSSR = http.get(`${BASE_URL}/ssr`);

    sleep(1);
}
