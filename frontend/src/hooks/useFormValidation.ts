import { useCallback } from 'react';
import * as Yup from 'yup';

interface ValidationRule {
  type: string;
  params?: any[];
  message?: string;
}

interface FieldValidation {
  rules: ValidationRule[];
  label?: string;
}

interface FormValidation {
  [key: string]: FieldValidation;
}

export const useFormValidation = (validationSchema: FormValidation) => {
  const createYupSchema = useCallback(() => {
    const schema: { [key: string]: any } = {};

    Object.entries(validationSchema).forEach(([fieldName, field]) => {
      let fieldSchema = Yup.mixed();

      field.rules.forEach((rule) => {
        const { type, params = [], message } = rule;
        const method = fieldSchema[type];

        if (method) {
          fieldSchema = method.apply(fieldSchema, [
            ...params,
            message || `${field.label || fieldName} is invalid`,
          ]);
        }
      });

      schema[fieldName] = fieldSchema;
    });

    return Yup.object().shape(schema);
  }, [validationSchema]);

  const validateField = useCallback(
    async (fieldName: string, value: any) => {
      try {
        const schema = createYupSchema();
        await schema.validateAt(fieldName, { [fieldName]: value });
        return { isValid: true, error: null };
      } catch (error) {
        return {
          isValid: false,
          error: error instanceof Error ? error.message : 'Invalid value',
        };
      }
    },
    [createYupSchema]
  );

  const validateForm = useCallback(
    async (values: Record<string, any>) => {
      try {
        const schema = createYupSchema();
        await schema.validate(values, { abortEarly: false });
        return { isValid: true, errors: null };
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors: Record<string, string> = {};
          error.inner.forEach((err) => {
            if (err.path) {
              errors[err.path] = err.message;
            }
          });
          return { isValid: false, errors };
        }
        return {
          isValid: false,
          errors: { _form: 'An error occurred during validation' },
        };
      }
    },
    [createYupSchema]
  );

  return {
    validateField,
    validateForm,
    createYupSchema,
  };
}; 