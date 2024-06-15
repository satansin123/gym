const mongoose = require('mongoose');
const { Schema } = mongoose;

const clanSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  members: {
    type: [String]
  },
  clanLeader:{
    type: String
  },
  steps: {
    type: Number
  }
  
});

module.exports = mongoose.model('clan',clanSchema)