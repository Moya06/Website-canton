import { validators } from './validators.js';

export class FormValidator {
    constructor(formId, schema, endPoint = '') {
        this.form = document.getElementById(formId);

        if (!this.form) {
            console.error(`No se encontró ningún formulario con el ID "${formId}".`);
            return;
        }

        this.schema = schema;
        this.inputs = Array.from(this.form.querySelectorAll('input, select'));
        this.spanLabel = null;
        this.init();
    }

    init() {
        this.inputs.forEach(input => {
            // Try to find label element
            let label = input.nextElementSibling;
            
            // If next sibling is not a label, try to find it by 'for' attribute
            if (!label || !label.tagName || label.tagName.toLowerCase() !== 'label') {
                const labelFor = document.querySelector(`label[for="${input.id}"]`);
                if (labelFor) {
                    label = labelFor;
                }
            }

            if (label) {
                if (!label.dataset.originalText) {
                    label.dataset.originalText = label.textContent;
                }

                const eventType = (input.type === 'file' || input.tagName.toLowerCase() === 'select') ? 'change' : 'input';
                input.addEventListener(eventType, () => this.validateInput(input));
                input.addEventListener('blur', () => this.validateInput(input));
            } else {
                console.warn(`No se encontró label para el input con id: ${input.id}`);
            }
        });

        this.form.addEventListener('submit', (e) => {
            // Allow form submission - just validate for visual feedback
            this.validateForm();
            // Don't prevent submission even if there are validation errors
        });
    }

    validateInput(input) {
        const fieldName = input.id;
        const rules = this.schema[fieldName] || [];
        let isValid = true;
        let errorMessage = '';

        for (const rule of rules) {
            const validator = validators[rule.name];
            if (!validator) continue;

            let result;
            if (input.type === 'file') {
                result = validator(input.files, rule.param);
            } else if (rule.name === 'matches') {
                result = validator(input.value.trim(), rule.param, this.form);
            } else {
                result = validator(input.value.trim(), rule.param);
            }

            if (!result.isValid) {
                isValid = false;
                errorMessage = result.error;
                break;
            }
        }

        this.updateInputFeedback(input, isValid, errorMessage);
        return isValid;
    }

    updateInputFeedback(input, isValid, errorMessage) {
        // Try to find label element (for login/signup forms)
        let label = input.nextElementSibling;
        
        // If next sibling is not a label, try to find it by 'for' attribute
        if (!label || !label.tagName || label.tagName.toLowerCase() !== 'label') {
            const labelFor = document.querySelector(`label[for="${input.id}"]`);
            if (labelFor) {
                label = labelFor;
            }
        }

        if (label) {
            if (!label.dataset.originalText) {
                label.dataset.originalText = label.textContent;
            }

            if (isValid) {
                label.textContent = label.dataset.originalText;
                label.classList.remove('error_message');
                input.classList.remove('error');
            } else {
                label.textContent = errorMessage;
                label.classList.add('error_message');
                input.classList.add('error');
            }
        } else {
            console.warn(`No se encontró label para el input con id: ${input.id}`);
        }
    }

    validateForm() {
        let formIsValid = true;

        this.inputs.forEach(input => {
            const inputIsValid = this.validateInput(input);
            if (!inputIsValid) {
                formIsValid = false;
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        return formIsValid;
    }
}

// Ejemplo de uso asegurando que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const schema = {
        nombre: [
            { name: 'required' },
            { name: 'minLength', param: 3 }
        ],
        archivo: [
            { name: 'fileSize', param: 2000000 } // 2 MB
        ]
    };

    new FormValidator('form', schema);
});
