import { Schema, model } from 'mongoose';


const AnnoucementSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: [true, 'Date must be provided']
    },
    address: {
        type: String,
        required: [true, 'Address must be provided']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: [true, 'Type must be provided']
    },
},{versionKey: false});

export default model('Annoucements', AnnoucementSchema);