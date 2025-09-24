// src/components/LoginCard.tsx
import { Mail, KeyRound } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import ErrorAlert from './ErrorAlert';
import InputField from './InputField';
import Logo from './Logo';
import { Button } from './ui/Button'; // <-- Import our new Button

const LoginCard = () => {
  const {
    loginData,
    isLoading,
    apiError,
    validationErrors,
    handleInputChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-border shadow-lg rounded-lg p-6">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Email"
          Icon={Mail}
          value={loginData.email}
          onChange={handleInputChange}
          error={validationErrors.email}
          disabled={isLoading}
        />
        <InputField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          Icon={KeyRound}
          value={loginData.password}
          onChange={handleInputChange}
          error={validationErrors.password}
          disabled={isLoading}
        />

        {apiError && <ErrorAlert text={apiError} />}

        <div className="pt-2">
          {/* 👇 REPLACED THE OLD BUTTON WITH OUR NEW COMPONENT */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? 'Authorizing...' : 'Authorize'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;