const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@test.com',
  password: '123456',
};

const testUser2 = {
  email: 'test2@test2.com',
  password: '123456',
};

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('example test - delete me!', () => {
    expect(1).toEqual(1);
  });

  afterAll(() => {
    pool.end();
  });
});
