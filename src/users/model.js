const mongoose = require('mongoose')

const USER_SCHEMA = new mongoose.Schema({
  username: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, trim: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String },
  roles: {
    type: [{
      type: String,
      enum: ['user_regular', 'user_admin', 'user_super'],
      required: true
    }],
    default: ['user_regular']
  },
  resources: [{ type: String, required: true }],
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['disabled', 'enabled'],
    default: 'enabled'
  },
  createdAt: { type: Date, required: true, default: Date.now },
  modifiedAt: { type: Date, required: false },
  deletedAt: { type: Date, required: false }
}, { collection: 'users' })

module.exports = mongoose.model('User', USER_SCHEMA)
