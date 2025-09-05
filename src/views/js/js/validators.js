// Validadores básicos
export const validators = {
  required: (value) => ({
    isValid: !!value.trim(),
    error: 'Este campo es requerido'
  }),

  minLength: (value, min) => ({
    isValid: value.length >= min,
    error: `Mínimo ${min} caracteres`
  }),

  maxLength: (value, max) => ({
    isValid: value.length <= max,
    error: `Maximos ${max} caracteres`
  }),

  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    error: 'Email inválido'
  }),

  alpha: (value) => ({
    isValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
    error: 'Solo letras permitidas'
  }),

  password: (value) => ({
    isValid: value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value),
    error: 'Debe tener 8+ caracteres, una mayúscula y un número'
  }),

  matches: (value, fieldId, form) => ({
    isValid: value === form.querySelector(`#${fieldId}`).value,
    error: 'Las contraseñas no coinciden'
  }),

  number: (value) => ({
    isValid: typeof Number(value) === 'number' && !isNaN(Number(value)) && Number(value) > 0,
    error: 'Debe ser un número válido y mayor que cero'
  }),

  fileRequired: (files) => ({
    isValid: files && files.length > 0,
    error: 'Debes seleccionar un archivo'
  }),

  fileType: (files, allowedTypes) => {
    if (!files || files.length === 0) return { isValid: true, error: '' };
    const valid = Array.from(files).every(file => allowedTypes.includes(file.type));
    return {
      isValid: valid,
      error: `Tipo de archivo permitido: ${allowedTypes.join(', ')}`
    };
  },

  fileMaxSize: (files, maxSizeMB) => {
    if (!files || files.length === 0) return { isValid: true, error: '' };
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const valid = Array.from(files).every(file => file.size <= maxSizeBytes);
    return {
      isValid: valid,
      error: `El archivo debe pesar menos de ${maxSizeMB} MB`
    };
  },
};
