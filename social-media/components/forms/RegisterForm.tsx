import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerScheme } from "@/lib/schemas/auth.schema";
import { useUser } from "@/hooks/auths/useUser";
import { useState } from "react";
import { loginWithGoogle, registerAccount } from "@/lib/api/auth.api";
import { toast } from "sonner";

type props = {
  onSuccess: () => void;
};
export default function RegisterForm(props: props) {
  const router = useRouter();
  const { mutate } = useUser();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerScheme),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      await registerAccount(data);
      props.onSuccess();
      toast.success("Success created account", {
        position: "top-center",
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login gagal");
    }
  }

  async function handleGoogleSuccess(credential: string) {
    setServerError(null);
    try {
      await loginWithGoogle(credential);
      await mutate();
      router.push("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login Google gagal");
    }
  }

  return (
    <div>
      <div className="lg:w-[30rem] space-y-6 p-6">
        <div className="text-center">
          <h1 className="font-bold text-4xl">Create your accounts</h1>
          <p className="text-white/50">It only takes a minute.</p>
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
            placeholder="Name"
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
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
          <Input
            placeholder="Confirm password"
            type="password"
            {...register("confirmPassword")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
          <Button
            className="text-lg w-full bg-brand5 cursor-pointer"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Register"}
          </Button>
        </form>{" "}
      </div>
    </div>
  );
}
