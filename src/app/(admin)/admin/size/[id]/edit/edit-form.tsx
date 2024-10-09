'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';
import { useMutation } from '@tanstack/react-query';
import { AlertDeleteDialog } from '@/components/alert/delete';

import { CreateSizeSchema, CreateSizeSchemaType } from '@/schema/size';
import { EditSizeAction, SizeDeleteAction } from '@/actions/size';

export function EditSizeForm({
  defaultValues,
}: {
  defaultValues: Size | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await SizeDeleteAction(id),

    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: 'Success',
          description: data.success,
        });
      }

      if (data?.error) {
        toast({
          title: 'Error',
          description: data.error,
        });
      }

      router.push('/admin/size');
      onShowClose();
    },
  });

  const form = useForm<CreateSizeSchemaType>({
    resolver: zodResolver(CreateSizeSchema),
    defaultValues: {
      name: defaultValues?.name,
      value: defaultValues?.value,
    },
  });

  function onSubmit(values: CreateSizeSchemaType) {
    startTransition(() => {
      EditSizeAction(values, defaultValues!.id).then((data) => {
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
          router.push('/admin/size');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Edit Size</h2>
          <span>edit the new size</span>
        </div>
        <Button
          variant={'destructive'}
          className="space-x-1"
          onClick={() =>
            onDeleteShow({
              text: 'Delete Size',
              onAccept: () => onDeleteConfirm(defaultValues!.id),
            })
          }
        >
          <span>Delete</span>
          <Trash className="size-4" />
        </Button>
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
                  <FormDescription>
                    This is your size name of the store.
                  </FormDescription>
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
                    <Input placeholder="Size value" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your size value of the store.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Edit
          </Button>
        </form>
      </Form>

      <AlertDeleteDialog />
    </div>
  );
}
