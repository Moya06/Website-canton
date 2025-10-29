import { Schema, model } from 'mongoose';

const EventoSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    description: {
        type: String,
        required: [true, 'Description must be provided']
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
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'event'
    },
    capacity: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['cultural', 'deportivo', 'social', 'educativo', 'comercial'],
        default: 'social'
    },
    image: {
        type: String,
        default: '/imgs/img_cards/event.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default model('Eventos', EventoSchema);
