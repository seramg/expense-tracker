'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { useGetQuery } from '@/hooks/reactQuery/useGetQuery';
import { ICategory } from '@/lib/types/category';
import React from 'react';
import CategoryForm from './Form';
import { CATEGORY_OPTIONS } from '@/constants/categories';

const CategoryList = () => {
  const { data, isLoading, error, refetch } = useGetQuery<ICategory[]>(`/api/categories`);
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className='flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:justify-between'>
        <h1 className='text-3xl font-bold'>My Categories</h1>
        <CategoryForm refetchList={refetch} />
      </div>
      {isLoading ? (
        <p className='mt-5'>Loading categories...</p>
      ) : (
        <div className='mt-5 overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/6'>#</TableHead>
                <TableHead className='w-1/2'>Category Name</TableHead>
                <TableHead className='w-1/2'>Category Type</TableHead>
                <TableHead className='w-1/3'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((category, index) => (
                <TableRow key={category.name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {CATEGORY_OPTIONS.find((option) => option.value === category.type)?.label}
                  </TableCell>
                  <TableCell className='text-right'>{0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default CategoryList;
