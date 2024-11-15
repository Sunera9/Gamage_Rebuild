const mongoose = require('mongoose')

const ProgramSchema = new mongoose.Schema({

    pid: {
        type:String,
        require:true
    },

    fname: {
        type:String,
        require:true
    },

    position: {
        type:String,
        require:true
    },

    sdate: {
        type:String,
        require:true
    },

    edate: {
        type:String,
        require:true
    }

})

const ProgramModel = mongoose.model("programs", ProgramSchema)
module.exports = ProgramModel