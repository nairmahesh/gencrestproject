// src/hooks/useLogin.ts
import { useState } from 'react';
import type { AuthLoginRequest } from '../interfaces';
import { apiService } from '../services/apiService'; // Assuming you have this
import { isAxiosError } from 'axios';

type LoginStatus = 'idle' | 'loading' | 'error' | 'success';
type ValidationErrors = Partial<Record<keyof AuthLoginRequest, string>>;

export const useLogin = () => {
  const [loginData, setLoginData] = useState<AuthLoginRequest>({ email: '', password: '' });
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const isLoading = status === 'loading';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for the field being edited
    if (validationErrors[name as keyof AuthLoginRequest]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: ValidationErrors = {};
    if (!loginData.email) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!loginData.password) {
      errors.password = 'Password is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setStatus('loading');
    try {
      const response = await apiService.login(loginData);
      // On success, you would typically set user context, store tokens, and redirect.
      console.log('Login successful:', response.data.user.name);
      setStatus('success');
      // Example: window.location.href = '/dashboard';
    } catch (error) {
      setStatus('error');
      if (isAxiosError(error) && error.response) {
        setApiError(error.response.data.message || 'Invalid credentials. Please try again.');
      } else {
        setApiError('An unexpected error occurred. Please check your connection.');
      }
    }
  };

  return {
    loginData,
    status,
    isLoading,
    apiError,
    validationErrors,
    handleInputChange,
    handleSubmit,
  };
};