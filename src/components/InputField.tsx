// src/components/InputField.tsx
import type { LucideProps } from 'lucide-react';
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  Icon: React.ComponentType<LucideProps>;
  error?: string;
}

const InputField = ({ id, label, Icon, error, ...props }: InputFieldProps) => (
  <div className="w-full">
    <label htmlFor={id} className="sr-only">{label}</label>
    <div className="relative border border-slate-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
      <input
        id={id}
        className="w-full p-2 pr-10 bg-transparent focus:outline-none"
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <Icon className="text-slate-400" aria-hidden="true" />
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
  </div>
);

export default InputField;