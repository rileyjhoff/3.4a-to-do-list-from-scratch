const pool = require('../utils/pool');

module.exports = class ToDo {
  id;
  user_id;
  task;
  completed;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.task = row.task;
    this.completed = row.completed;
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `SELECT *
      FROM todos
      WHERE user_id=$1
      ORDER BY created_at DESC`,
      [user_id]
    );

    return new ToDo(rows[0]);
  }

  static async insert({ user_id, task, completed }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (task, completed, user_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [user_id, task, completed]
    );

    return new ToDo(rows[0]);
  }
};
