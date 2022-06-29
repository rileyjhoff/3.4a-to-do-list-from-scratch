const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const ToDo = require('../lib/models/ToDo');

const testUser1 = {
  email: 'test@test.com',
  password: '123456',
};

const testUser2 = {
  email: 'test2@test2.com',
  password: '1234567',
};

const registerAndLogin = async (userProps = {}) => {
  const password1 = userProps.password ?? testUser1.password;
  const agent = request.agent(app);
  const user1 = await UserService.createUser({ ...testUser1, ...userProps });
  await agent
    .post('/api/v1/users/sessions')
    .send({ email: user1.email, password: password1 });
  return [agent, user1];
};

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /api/v1/todos/ should return all todos for the authenticated user', async () => {
    const res1 = await request(app).get('/api/v1/todos/');

    expect(res1.status).toEqual(401);

    const [agent, user1] = await registerAndLogin();
    const user1ToDo = await ToDo.insert({
      completed: false,
      task: 'do something',
      user_id: user1.id,
    });
    const user2 = await UserService.createUser(testUser2);
    const user2ToDo = await ToDo.insert({
      completed: true,
      task: 'do something else',
      user_id: user2.id,
    });

    const res2 = await agent.get('/api/v1/todos/');

    expect(res2.status).toEqual(200);
    expect(res2.body).toEqual(user1ToDo);
    expect(res2.body).not.toContain(user2ToDo);
  });

  it('POST /api/v1/todos/ should add a new todo for the authenticated user', async () => {
    const newToDo = {
      completed: false,
      task: 'do something',
    };

    const res1 = await request(app).post('/api/v1/todos/').send(newToDo);

    expect(res1.status).toEqual(401);

    const [agent, user1] = await registerAndLogin();

    const res2 = await agent.post('/api/v1/todos/').send(newToDo);

    expect(res2.status).toEqual(200);
    expect(res2.body).toEqual({
      ...newToDo,
      user_id: user1.id,
      id: expect.any(Number),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
