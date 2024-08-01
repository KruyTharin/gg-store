'use client';

import { CreateCategoryAction } from '@/actions/category';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';

function CreateCategoryForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  function onSubmit(values: CreateCategorySchemaType) {
    startTransition(() => {
      CreateCategoryAction(values).then((data) => {
        if (data?.error) {
          toast({
            title: 'Error',
            description: data.error,
          });
        }

        if (data?.success) {
          toast({
            title: 'Success',
            description: data.success,
          });

          router.push('/category');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Create Categories</h2>
          <span>add new category</span>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] mt-5"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormDescription>This is your category name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateCategoryForm;
