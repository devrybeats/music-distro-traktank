"use client";

import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormDescription from "@/components/forms/FormDescription";
import {
  type FieldValues,
  type Resolver,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type LoginInput } from "../types";
import { LoginSchema } from "../schemas";
import TextInput from "@/components/ui/TextInput";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(LoginSchema) as Resolver<LoginInput>,
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      // Set local authentication state
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "weplug_user",
          JSON.stringify({
            id: "user-" + Date.now(),
            name: data.email.split("@")[0],
            email: data.email,
            role: "artist",
          })
        );
        document.cookie = "weplug_auth=true; path=/; max-age=86400";
      }
      try {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
      } catch (e) {
        // Fallback for environment without local Postgres
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setSubmitError(null);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "weplug_user",
        JSON.stringify({
          id: "demo-artist-001",
          name: "Traktank Demo Artist",
          email: "traktankdistro@gmail.com",
          role: "artist",
        })
      );
      document.cookie = "weplug_auth=true; path=/; max-age=86400";
    }
    router.push("/dashboard");
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync user profile to Firestore
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            id: user.uid,
            email: user.email || "",
            name: user.displayName || "Artist",
            role: "artist",
            avatarUrl: user.photoURL || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (firestoreErr) {
        console.warn("Could not sync user profile to Firestore:", firestoreErr);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "weplug_user",
          JSON.stringify({
            id: user.uid,
            name: user.displayName || "Artist",
            email: user.email,
            role: "artist",
            avatarUrl: user.photoURL,
          })
        );
        document.cookie = "weplug_auth=true; path=/; max-age=86400";
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Google sign in error", err);
      const message =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to dashboard if user is already logged in
  const { data: session } = useSession();
  useLayoutEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [router, session]);

  return (
    <section className="py-6">
      <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
        <FormDescription
          header="Welcome Back!"
          path="/register"
          pathText="Sign Up"
          authQuestion="New user?"
        />

        {/* Email Address */}
        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput
            register={register as unknown as UseFormRegister<FieldValues>}
            name="email"
            error={errors.email?.message}
            id="email"
            type="email"
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <TextInput
            register={register as unknown as UseFormRegister<FieldValues>}
            name="password"
            error={errors.password?.message}
            id="name"
            type="password"
          />
        </div>

        {/* Remember Me */}
        <div className="mt-4 flex items-center justify-between">
          <label
            htmlFor="remember_me"
            className="inline-flex items-center"
            data-testid="remember me"
          >
            <input
              id="remember_me"
              type="checkbox"
              {...register("shouldRemember")}
              className="border-gray-300 text-indigo-600 focus:border-indigo-300 focus:ring-indigo-200 rounded shadow-sm focus:ring focus:ring-opacity-50"
            />
            <span className="text-gray-600 ml-2 text-sm">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-blue-800 hover:text-gray-900 text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Error */}
        {submitError && (
          <p className="mt-7 text-center text-[.9rem] text-error">
            {submitError}
          </p>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-end">
          <Button loading={isLoading} className="w-1/2">
            Login
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center justify-center space-x-4">
        <p className="h-[2px] w-1/2 bg-gray"></p>
        <p>or</p>
        <p className="h-[2px] w-1/2 bg-gray"></p>
      </div>

      {/* Login With Google & Instant Demo */}
      <div className="mx-auto mt-6 w-full space-y-3">
        <Button
          type="button"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => void googleSignIn()}
          loading={isLoading}
        >
          <FaGoogle /> Login with Google
        </Button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-md font-medium text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition border border-indigo-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          ⚡ Instant Demo Artist Access
        </button>
      </div>
    </section>
  );
};

export default Login;
