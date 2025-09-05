import { FormValidator } from "./FormValidator.js";

// Schema validation
const validationSchema = {
    name_entrepreneur: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    description: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    type_entrepreneur: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    contact: [
        { name: 'required' },
        { name: 'number' }
    ],
    img: [
        { name: 'fileRequired' },
        { name: 'fileType', param: ['image/png', 'image/jpeg'] },
        { name: 'fileMaxSize', param: 2 } // 2 MB
    ]
};

// Creation of class FormValidator
new FormValidator('form', validationSchema);