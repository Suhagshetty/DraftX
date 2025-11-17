import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation"; // ✅ FIXED

import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be atleast 6 characters min"),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be atleast 2 characters"),
  lastName: z.string().min(2, "Last name must be a min of 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum of 6 characters needed"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signIn",
      });
      router.push("./dashbaord");
    } catch (error) {
      console.error(error);
      signInForm.setError("password", {
        message: "Invalid",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        flow: "signUp",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("sign up error", error);
      signUpForm.setError("root", {
        message: "Fail",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error");
    }
  };

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
  };
};
