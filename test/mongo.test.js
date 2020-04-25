const Mongo = require('../mongo');
const mongoose = require('mongoose');

test('mongo', async () => {
  expect(() => Mongo.connect(mongoose)).rejects.toThrow('Invalid connect url');
  expect(() => Mongo.connect(mongoose, '')).rejects.toThrow('Invalid connect url');
  expect(() => Mongo.connect(mongoose, 'fdasfadsfads')).rejects.toThrow('Invalid connect url');
});
