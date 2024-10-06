'use client';

import { CreateSizeAction } from '@/actions/size';
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
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { CreateSizeSchema, CreateSizeSchemaType } from '@/schema/size';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';

function CreateSizeForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateSizeSchemaType>({
    resolver: zodResolver(CreateSizeSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  });

  function onSubmit(values: CreateSizeSchemaType) {
    startTransition(() => {
      CreateSizeAction(values).then((data) => {
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
          router.push('/size');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Create Size</h2>
          <span>add new size</span>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] mt-5"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Size name" {...field} />
                  </FormControl>
                  <FormDescription>This is your size name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Size value..." {...field} />
                  </FormControl>
                  <FormDescription>This is your size value.</FormDescription>
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

export default CreateSizeForm;
