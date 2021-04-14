const mongoose = require("mongoose");
const meetingSchema = new mongoose.Schema({
    roomname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true

        
    },
    date: {
        type: Date,
        required: true
    }
    //time: {
      //  type: String,
       // required: true
    //}
})

const Meeting = new mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
