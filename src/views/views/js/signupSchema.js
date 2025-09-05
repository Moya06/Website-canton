import { FormValidator } from './FormValidator.js';

// Schema validation
const validationSchema = {
    name: [
        { name: 'required' },
        { name: 'minLength', param: 2 },
        { name: 'alpha' }
    ],
    last_name: [
        { name: 'required' },
        { name: 'minLength', param: 2 },
        { name: 'alpha' }
    ],
    email: [
        { name: 'required' },
        { name: 'email' }
    ],
    password: [
        { name: 'required' },
        { name: 'password' }
    ],
    password_check: [
        { name: 'required' },
        { name: 'matches', param: 'password' }
    ]
};


// Creation of class FormValidator
new FormValidator('form', validationSchema);