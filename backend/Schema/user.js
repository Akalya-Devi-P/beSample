const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    name:{type:String, default:""},
    email:{type:String},
    mobile:{type:String},
    password:String
    },
    {collection:'dataList'}
)

const User = mongoose.model("user",userSchema);

module.exports = User;