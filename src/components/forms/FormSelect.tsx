import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IOptions } from './forms.interface';
import Image from 'next/image';
import { Spinner } from '../ui/spinner';

interface FormSelectProps {
  name: string;
  label: string;
  options?: IOptions[];
  placeholder?: string;
  required?: boolean;
  labelValue?: string;
  isLoading?: boolean;
}

const FormSelect = ({
  name,
  label,
  options,
  placeholder,
  required,
  labelValue,
  isLoading,
}: FormSelectProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              disabled={isLoading || options === undefined || options?.length === 0}
              onValueChange={field.onChange}
              value={field.value}
              required={required}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <>
                      {placeholder || `Select ${label}`}{' '}
                      {isLoading ? <Spinner className='size-3' /> : null}
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{labelValue || `Select ${label}`}</SelectLabel>
                  {!isLoading &&
                    options &&
                    options.map((option) => (
                      <SelectItem key={option.value} value={option.value} className='flex !gap-2'>
                        {option.icon && (
                          <div className='relative h-4 w-4'>
                            <Image
                              src={option.icon}
                              alt={option.label}
                              fill
                              className='object-contain'
                            />
                          </div>
                        )}
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
