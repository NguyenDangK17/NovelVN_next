import React from 'react';

export interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
}) => (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      className={`bg-[#3d414a] text-white rounded-lg block w-full p-2.5 ${
        error ? 'border-2 border-red-500' : 'focus:ring-primary-600 focus:border-primary-600'
      }`}
      value={value}
      onChange={onChange}
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
