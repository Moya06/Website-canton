import { FormValidator } from "./FormValidator.js";

// Schema validation
const validationSchema = {
    description: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    address: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ]
};


// Creation of class FormValidator
new FormValidator('form', validationSchema);