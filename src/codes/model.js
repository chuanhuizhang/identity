const Config = require('config')
const mongoose = require('mongoose')

const CODE_SCHEMA = new mongoose.Schema({
  type: {
    type: String,
    enum: ['forgot_password', 'sign_up_verification'],
    required: true
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  code: { type: String, required: true },
  createdAt: { type: Date, index: { unique: true, expires: Config.get('code.expiresIn') } }
}, { collection: 'codes' })

module.exports = mongoose.model('code', CODE_SCHEMA)
