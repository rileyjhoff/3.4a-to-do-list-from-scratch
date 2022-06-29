const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const ToDo = require('../models/ToDo');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const toDos = await ToDo.getAll(req.user.id);
      res.json(toDos);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const toDo = await ToDo.insert({ ...req.body, user_id: req.user.id });
      res.json(toDo);
    } catch (e) {
      next(e);
    }
  });
