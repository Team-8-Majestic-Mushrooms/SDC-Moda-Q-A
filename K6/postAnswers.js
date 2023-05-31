const http = require('k6/http');
const { sleep, check } = require('k6');

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 1000 },
    { duration: '10s', target: 2000 }, 
  ],
};

export default function () {
  const questionId = Math.floor(Math.random() * 10);
  const payload = JSON.stringify({
    body: 'Sample answer',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    photos: ['https://google.com/photo1.jpg', 'https://google.com/photo2.jpg'],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    `http://localhost:3000/qa/questions/${questionId}/answers`,
    payload,
    params,
  );

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(10);
}
