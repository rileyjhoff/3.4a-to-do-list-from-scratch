const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.createUser(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully' });
    } catch (e) {
      next(e);
    }
  })
  .get('/me', authenticate, async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (e) {
      next(e);
    }
  })
  .delete('/sessions', async (req, res, next) => {
    try {
      res.clearCookie(process.env.COOKIE_NAME).status(204).send();
    } catch (e) {
      next(e);
    }
  });
