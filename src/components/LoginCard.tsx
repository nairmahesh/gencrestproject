// src/components/LoginCard.tsx
import { Mail, KeyRound, LoaderCircle } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import ErrorAlert from './ErrorAlert';
import InputField from './InputField';
import Logo from './Logo';

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
    <div className="max-w-md w-full bg-white border border-slate-300 shadow-lg rounded-lg p-6">
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-primary-600 text-primary-50 font-semibold px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-500/50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin mr-2" size={20} />
                Authorizing...
              </>
            ) : (
              'Authorize'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;