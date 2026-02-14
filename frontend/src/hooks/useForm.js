/**
 * useForm Hook
 * Provides form state management and validation
 */

import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, onSubmit = null, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur if validator provided
    if (validate) {
      const fieldError = validate(name, values[name]);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    }
  }, [validate, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validate) return true;

    const newErrors = {};
    Object.keys(values).forEach((field) => {
      const error = validate(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validate, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const touchedFields = {};
      Object.keys(values).forEach((field) => {
        touchedFields[field] = true;
      });
      setTouched(touchedFields);

      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value manually
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Set multiple values
  const setFieldValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Utilities
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldValues,
    validateForm,

    // Field-level utilities
    getFieldProps: (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    }),

    getFieldMeta: (name) => ({
      value: values[name] || '',
      error: errors[name],
      touched: touched[name],
    }),
  };
};

export default useForm;
