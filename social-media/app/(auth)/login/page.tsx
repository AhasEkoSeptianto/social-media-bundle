"use client";

import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { useState } from "react";

export default function Page() {
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  const ChangeFormAuth = () => {
    setAuthPage((prev) => (prev === "login" ? "register" : "login"));
  };
  return (
    <div className="grid lg:grid-cols-12">
      <div className="col-span-8 relative">
        <div className="z-0 bg-[url(/images/post1.avif)] h-screen w-full bg-cover absolute top-0 left-0"></div>
        <div className="bg-black/80 lg:bg-black/0 bg-radial-[at_60%_60%] from-purple-500/30 via-violent to-indigo-950/80 to-70% h-screen z-20 relative p-10 lg:p-20 flex flex-col justify-between ">
          <h1 className="text-4xl  font-bold opacity-10 lg:opacity-100">
            Prism
          </h1>
          <div className="opacity-10 lg:opacity-100">
            <h2 className="text-3xl ">"Share your world, discover their."</h2>
            <p>Join 4.2 million people already on Prism</p>
          </div>
        </div>
      </div>
      <div className="col-span-4 bg-brand">
        <div className="grid w-full place-content-center h-screen absolute top-0 z-90 lg:relative">
          <div className="p-6 lg:p-0">
            {authPage === "login" ? (
              <div>
                <LoginForm />
                <p className="text-center">
                  Don't have an account?{" "}
                  <span
                    className="text-brand5 cursor-pointer"
                    onClick={ChangeFormAuth}
                  >
                    Create one
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <RegisterForm onSuccess={() => setAuthPage("login")} />
                <p className="text-center">
                  Already have an account?{" "}
                  <span
                    className="text-brand5 cursor-pointer"
                    onClick={ChangeFormAuth}
                  >
                    Sign in
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
