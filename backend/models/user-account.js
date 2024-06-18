const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAccountSchema = new Schema({
  firstName: {
    type: String, minLength: 1, maxLength: 30, require: true,
  },
  lastName: {
    type: String, minLength: 1, maxLength: 30, require: true,
  },
  email: {
    type: String, minLength: 1, require: true,
  },
  password: {
    type: String, minLength: 8, require: true,
  },
  friends: {
    type: [Schema.Types.Mixed],
  },
  online: {
    type: Boolean,
  },
});

module.exports = mongoose.model('UserAccountSchema', UserAccountSchema, 'user-account');
