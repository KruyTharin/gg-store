'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import React, { memo } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';

const DeleteSchema = z.object({
  deleteConfirmation: z.string().refine((val) => val === 'delete', {
    message: "You must type 'delete' to confirm.",
  }),
});

type DeleteSchemaType = z.infer<typeof DeleteSchema>;

export const AlertDeleteDialog = memo(() => {
  const { isOpen, text, onClose, _onAccept } = useDeleteAlertStore();

  const form = useForm<DeleteSchemaType>({
    resolver: zodResolver(DeleteSchema),
    defaultValues: {
      deleteConfirmation: undefined,
    },
  });

  return (
    <div>
      <div className="bg-green-500 w-full h-full relative">
        <AlertDialog open={isOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="justify-center sm:text-center">
              <AlertDialogTitle>{text}</AlertDialogTitle>
              <AlertDialogDescription>
                Please enter word{' '}
                <span className="font-bold text-rose-500">“delete”</span> to
                field below to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                className="flex gap-y-3 justify-center flex-col"
                onSubmit={form.handleSubmit(_onAccept)}
              >
                <FormField
                  control={form.control}
                  name="deleteConfirmation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input placeholder="Enter word" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center gap-x-2">
                  <Button onClick={onClose} type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive">
                    Delete
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});

AlertDeleteDialog.displayName = 'AlertDeleteDialog';
