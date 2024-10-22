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
import { CreateColorSchema, CreateColorSchemaType } from '@/schema/color';
import { ColorDeleteAction, EditColorAction } from '@/actions/color';
import { ColorPicker } from '@/components/ui/color-picker';
import CustomLabel from '@/components/custom-label';

export function EditColorForm({
  defaultValues,
}: {
  defaultValues: Size | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await ColorDeleteAction(id),

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

      router.push('/admin/color');
      onShowClose();
    },
  });

  const form = useForm<CreateColorSchemaType>({
    resolver: zodResolver(CreateColorSchema),
    defaultValues: {
      name: defaultValues?.name,
      value: defaultValues?.value,
    },
  });

  function onSubmit(values: CreateColorSchemaType) {
    startTransition(() => {
      EditColorAction(values, defaultValues!.id).then((data) => {
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
          router.push('/admin/color');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Edit Color</h2>
          <span>edit the new color</span>
        </div>
        <Button
          variant={'destructive'}
          className="space-x-1"
          onClick={() =>
            onDeleteShow({
              text: 'Delete Color',
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
                  <CustomLabel required>Name</CustomLabel>
                  <FormControl>
                    <Input placeholder="Color name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your color name of the store.
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
                  <CustomLabel required>Color</CustomLabel>
                  <FormControl>
                    <ColorPicker
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    The color will set to black by default
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>

      <AlertDeleteDialog />
    </div>
  );
}
