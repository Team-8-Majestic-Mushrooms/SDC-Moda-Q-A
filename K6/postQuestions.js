import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 1000 },
    { duration: '10s', target: 2000 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    body: 'Sample question',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    'http://localhost:3000/qa/questions',
    payload,
    params,
  );

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(10);
}
