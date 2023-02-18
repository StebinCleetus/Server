const Mongoose = require("mongoose");
let MongooseSchema = Mongoose.Schema

const userSchema = new MongooseSchema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user"
        }
    }
)
var userModel = Mongoose.model("users", userSchema)
module.exports = userModel




