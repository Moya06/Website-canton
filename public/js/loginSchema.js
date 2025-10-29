import {FormValidator} from './FormValidator.js'

// Schema validation
const validationSchema = {
    email: [
        { name: 'required' },
        { name: 'email' }
    ],
    password: [
        { name: 'required' },
        { name: 'password' }
    ],
};


// Creation of class FormValidator
new FormValidator('form', validationSchema);