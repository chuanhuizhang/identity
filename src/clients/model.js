const mongoose = require('mongoose')

const CLIENT_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['web', 'spa', 'mobile'],
    default: 'web'
  },
  grantTypes: {
    type: [{
      type: String,
      enum: ['client_credentials', 'password', 'refresh_token', 'authorization_code'],
      required: true
    }],
    default: ['client_credentials', 'password', 'refresh_token']
  },
  clientKeyId: { type: String, unique: true, required: true },
  clientKeySecret: { type: String, required: true },
  roles: {
    type: [{
      type: String,
      enum: ['client_regular', 'client_admin', 'client_super'],
      required: true
    }],
    default: ['client_regular']
  },
  resources: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled'
  },
  createdAt: { type: Date, required: true, default: Date.now },
  modifiedAt: { type: Date, required: false },
  deletedAt: { type: Date, required: false }
}, { collection: 'clients' })

module.exports = mongoose.model('Client', CLIENT_SCHEMA)
