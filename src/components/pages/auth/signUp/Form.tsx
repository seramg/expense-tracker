"use client";

import { useForm } from "react-hook-form";
import { usePostMutation } from "@/hooks/reactQuery/useMutation";
import IAuthInfoProps from "../authInfo.interface";
import { toast } from "sonner";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const getFormSchema = Yup.object({
  name: Yup.string().min(3).required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type SignupFormData = Yup.InferType<typeof getFormSchema>;

export const SignupForm = ({ toggle }: IAuthInfoProps) => {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(getFormSchema),
  });

  const mutation = usePostMutation<SignupFormData>("/api/users/signup");
  const { mutate, error, isError, isPending } = mutation;

  const onSubmitHandler = (data: SignupFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success("User created successfully!", {
          description: "Please sign in to continue.",
        });
        toggle();
      },
      onError(error) {
        throw new Error(error?.message || "Signup failed");
      },
      onSettled() {
        reset();
      },
    });
  };

  return (
    <div className="w-80 p-6 bg-white shadow-lg border rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          {...register("name")}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          {...register("email")}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          {...register("password")}
          required
        />

        {isError && <p className="text-red-500 text-sm">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggle}
          className="text-blue-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
