const Mongoose = require("mongoose");
let MongooseSchema = Mongoose.Schema
const trackerSchema = new MongooseSchema(
    {
  empmail: {
    type: String,
  },
  tproject: {
    type: String,
  },
  ttask: {
    type: String,
  },
  tdes:{
    type: String,
  },
  tmeth:{
    type: String,
  },
  tstart: {
    type: String,
  },
  tend: {
    type: String,
  }
 
  
});
var timeTracker = Mongoose.model("timetrackers", trackerSchema)
module.exports = timeTracker;
