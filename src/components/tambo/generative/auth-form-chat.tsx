"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthFormChatProps {
  mode: "sign-in" | "sign-up";
  prefilledEmail?: string;
}

export function AuthFormChat({ mode, prefilledEmail }: AuthFormChatProps) {
  const router = useRouter();
  const [email, setEmail] = useState(prefilledEmail ?? "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (isSignUp && !name) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await authClient.signUp.email({
          email,
          password,
          name,
        });
        toast.success("Account created!");
      } else {
        await authClient.signIn.email({
          email,
          password,
        });
        toast.success("Signed in!");
      }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-2 px-1">
        {isSignUp ? <UserPlus className="w-4 h-4 text-cyan-500" /> : <LogIn className="w-4 h-4 text-cyan-500" />}
        <h3 className="font-semibold text-sm text-gray-900">
          {isSignUp ? "Create Account" : "Sign In"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {isSignUp && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
        />
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-9 px-3 pr-9 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-9 text-xs bg-cyan-500 hover:bg-cyan-600 rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
          ) : isSignUp ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
