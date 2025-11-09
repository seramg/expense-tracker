'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps extends React.ComponentProps<'input'> {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const FormInput = ({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  ...inputProps
}: FormInputProps) => {
  const { control, formState, getValues } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      if (getValues(name) === formState?.defaultValues?.[name]) inputRef.current.select();
    }
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              ref={inputRef}
              onFocus={handleFocus}
              required={required}
              type={type}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormInput;
