import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1200 },
    { duration: '10s', target: 2000 },
    { duration: '10s', target: 2000 },
  ],
};

export default function () {
  const questionId = Math.floor(Math.random() * 10);
  const res = http.get(
    `http://localhost:3000/qa/questions/${questionId}/answers`,
    { tags: { name: 'questionAnswers' } },
  );
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}