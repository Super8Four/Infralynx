import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    formik.handleSubmit();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    formik.handleChange(e);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    formik.handleBlur(e);
  };

  const setFieldValue = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const setFieldError = (field: string, message: string) => {
    formik.setFieldError(field, message);
  };

  const resetForm = () => {
    formik.resetForm();
  };

  return {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isSubmitting: formik.isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
  };
}; 