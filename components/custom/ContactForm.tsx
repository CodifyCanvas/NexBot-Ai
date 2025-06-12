'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { contactUsFormSchema } from '@/lib/zod/schema';
import { toast } from 'sonner';
import { CircleCheckIcon } from 'lucide-react';
import { Reference, useState } from 'react';
import Spinner from './Spinner';

type ContactFormData = z.infer<typeof contactUsFormSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Failed to send message.', {
          description: 'Please try again later.',
          richColors: true,
        });
        return;
      }

      toast.custom(() => (
        <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg border border-black/10 dark:border-none rounded-md flex items-center gap-2">
          <CircleCheckIcon size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm text-green-800 dark:text-green-300">
            Message sent successfully!
          </span>
        </div>
      ), {
        position: 'top-center',
      });

      form.reset();

    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong while sending your message.', {
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full p-6 space-y-6 isolate bg-white/5 backdrop-blur-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g. johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message..."
                    className="resize-none h-36 sm:h-52 md:h-52 lg:h-[10rem] overflow-y-auto custom-scrollbar"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-42 text-white bg-gradient-to-tr from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </div>

        </form>
      </Form>
    </Card>
  );
}
