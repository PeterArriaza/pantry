"use strict";

const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    pantryName: {
        type: String,
        required: true
    },
    memberIds: {
        type: String,
    }
})

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;
