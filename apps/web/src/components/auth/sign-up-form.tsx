import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signUp from "@/fetchers/user/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export type SignUpFormValues = {
  email: string;
  password: string;
  name: string;
};

const signUpSchema: ZodType<SignUpFormValues> = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password is too short" }),
  name: z.string(),
});

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { history } = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const { isError, error, mutateAsync } = useMutation({
    mutationFn: () =>
      signUp({
        email: form.getValues().email,
        password: form.getValues().password,
        name: form.getValues().name,
      }),
  });

  const onSubmit = async () => {
    await mutateAsync();
    history.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-300 mb-1.5 block">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                    placeholder="Andrej Acevski"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-300 mb-1.5 block">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-300 mb-1.5 block">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 mt-6"
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
