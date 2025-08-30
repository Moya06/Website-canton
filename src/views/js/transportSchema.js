import { FormValidator } from './FormValidator.js';

// Schema validation
const validationSchema = {
    name: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 10 },
    ],
    contact: [
        { name: 'required' },
        { name: 'minLength', param: 8 },
        { name: 'maxLength', param: 8 },
    ],
    schedule: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    address: [
        {name: 'required'},
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ]
};


// Creation of class FormValidator
new FormValidator('form', validationSchema);