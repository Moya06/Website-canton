import { validators } from './validators.js';

export class FormValidator {
    constructor(formId, schema, endPoint = '') {
        this.form = document.getElementById(formId);

        if (!this.form) {
            console.error(`No se encontró ningún formulario con el ID "${formId}".`);
            return;
        }

        this.schema = schema;
        this.inputs = Array.from(this.form.querySelectorAll('input, input[type="file"]'));
        this.spanLabel = null;
        this.init();
    }

    init() {
        this.inputs.forEach(input => {
            const spanLabel = input.nextElementSibling;

            if (spanLabel) {
                if (!spanLabel.dataset.originalText) {
                    spanLabel.dataset.originalText = spanLabel.textContent;
                }

                const eventType = input.type === 'file' ? 'change' : 'input';
                input.addEventListener(eventType, () => this.validateInput(input));
                input.addEventListener('blur', () => this.validateInput(input));
            } else {
                console.warn(`No se encontró spanLabel para el input con id: ${input.id}`);
            }
        });

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
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
        const spanLabel = input.nextElementSibling;

        if (isValid) {
            spanLabel.textContent = spanLabel.dataset.originalText;
            spanLabel.classList.remove('error_message');
        } else {
            spanLabel.textContent = errorMessage;
            spanLabel.classList.add('error_message');
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
