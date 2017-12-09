const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, trim: true, required: true},
  location: {type: String, trim: true, required: true},
  startDate: {type: Date},
  endDate: {type: Date},
  description: {type: String},
  organizer: {type: String},
  organizerDesc: {type: String},
  fee: {type: Number},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Brite = mongoose.model('Brite', schema);

module.exports = Brite;
