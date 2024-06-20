const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAccountSchema = new Schema({
  firstName: {
    type: String, minLength: 1, maxLength: 30, required: true,
  },
  lastName: {
    type: String, minLength: 1, maxLength: 30, required: true,
  },
  email: {
    type: String, minLength: 1, required: true, unique: true,
  },
  password: {
    type: String, minLength: 8, required: true,
  },
  friends: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  online: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('UserAccountSchema', UserAccountSchema, 'user-account');
