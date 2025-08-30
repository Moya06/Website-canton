import { FormValidator } from "./FormValidator.js";

// Schema validation
const validationSchema = {
    title: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 10 },
    ],
    description: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    address: [
        { name: 'required' },
        { name: 'minLength', param: 5 },
        { name: 'maxLength', param: 400 },
    ],
    img: [
        { name: 'file', },
        { extensions: ['jpg', 'jpeg', 'png'] },
        { maxSize: 2 * 1024 * 1024, }
    ]
};


// Creation of class FormValidator
new FormValidator('form', validationSchema);