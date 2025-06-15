import { useState, useCallback } from 'react';
import { useFormValidation } from './useFormValidation';

interface UseFormStateOptions<T> {
  initialValues: T;
  validationSchema: Record<string, any>;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useFormState = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormStateOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateField, validateForm } = useFormValidation(validationSchema);

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate field
      validateField(field as string, value).then(({ isValid, error }) => {
        setErrors((prev) => ({
          ...prev,
          [field]: isValid ? undefined : error,
        }));
      });
    },
    [validateField]
  );

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate form
      const { isValid, errors: validationErrors } = await validateForm(values);
      setErrors(validationErrors || {});

      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      handleChange(field, value);
    },
    [handleChange]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}; 