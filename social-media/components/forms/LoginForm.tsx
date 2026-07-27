import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth.schema";
import { useUser } from "@/hooks/auths/useUser";
import { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "@/lib/api/auth.api";
import { socket } from "@/lib/socket";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      await loginWithEmail(data);
      router.push("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login gagal");
    }
  }

  async function handleGoogleSuccess(credential: string) {
    setServerError(null);
    try {
      const user = await loginWithGoogle(credential);
      router.push("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login Google gagal");
    }
  }

  return (
    <div>
      <div className="lg:w-[30rem] space-y-6 p-6">
        <div className="text-center">
          <h1 className="font-bold text-4xl">Welcome</h1>
          <p className="text-white/50">Sign in to see what's happening.</p>
        </div>
        <div className="">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential && handleGoogleSuccess(res.credential)
            }
            onError={() => alert("Login gagal")}
          />
        </div>
        <Marker variant="separator">
          <MarkerContent>or continue with email</MarkerContent>
        </Marker>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            placeholder="Email address"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}

          <p className="text-right text-sm opacity-80">forgot password?</p>
          <Button
            className="text-lg w-full bg-brand5 cursor-pointer"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Sign in"}
          </Button>
          {serverError && (
            <p className="text-center text-danger">{serverError}</p>
          )}
        </form>{" "}
      </div>
    </div>
  );
}
