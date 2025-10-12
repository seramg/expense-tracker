"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import IAuthInfoProps from "../authInfo.interface";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { IError } from "@/services/api/fetch/fetch";
import { useState } from "react";

const getFormSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
type SigninFormData = Yup.InferType<typeof getFormSchema>;

export const SignInForm = ({ toggle }: IAuthInfoProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getFormSchema),
  });
  const credentialLoginMutation = useMutation<void, IError, SigninFormData>({
    mutationFn: async (data) => {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res) throw { message: "No response from server" } as IError;
      if (res.error) throw { message: res.error } as IError;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      reset();
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Signin failed");
    },
  });

  const onSubmit = (data: SigninFormData) => {
    credentialLoginMutation.mutate(data);
  };

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // trigger next-auth signIn for Google
      const res = await signIn("google");

      // sometimes res is null because the redirect flow hasn't completed
      if (!res) return; // just ignore it

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Logged in with Google!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Google login error:", error);
      toast.error((error as IError)?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-lg border rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign In
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          {...register("email")}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          {...register("password")}
          required
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <button
          type="submit"
          disabled={credentialLoginMutation.isPending}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {credentialLoginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-3 text-sm text-gray-500">or</p>

      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        disabled={loading}
        className="w-full bg-gray-100 text-black py-2 rounded mt-2 hover:bg-gray-200 transition"
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      <p className="text-center mt-4 text-sm">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={toggle}
          className="text-blue-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};
