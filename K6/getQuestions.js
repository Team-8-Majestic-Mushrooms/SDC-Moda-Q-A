import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1000 }, // 100 requests per second for 10 seconds
    { duration: '10s', target: 2000 }, // 1000 requests per second for 10 seconds
    { duration: '10s', target: 2000 }, // 1000 requests per second for 10 seconds
  ],
  // vus: 1000,
  // duration: '30s',
};
export default function () {
  const testId = Math.floor(Math.random() * 10);
  const res = http.get(
    `http://localhost:3000/qa/questions?product_id=${testId}`,
    { tags: { name: 'productId' } },
  );
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}