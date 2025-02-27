const request = require('supertest');
const app = require('../app');

describe('Healthcheck API', () => {
  it('should return 200 OK for the healthcheck endpoint', async () => {
    const res = await request(app).get('/api/v1/healthcheck');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('API is running');
  });
});
