import { Schema, model, version } from 'mongoose';


const ReportSchema = Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User must be provided']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{versionKey: false});

export default model('Reports', ReportSchema);