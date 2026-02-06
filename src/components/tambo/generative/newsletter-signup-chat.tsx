"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/lib/actions";
import { toast } from "sonner";

interface NewsletterSignupChatProps {
  prefilledEmail?: string;
  message?: string;
}

export function NewsletterSignupChat({ prefilledEmail, message }: NewsletterSignupChatProps) {
  const [email, setEmail] = useState(prefilledEmail ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        toast.success("Subscribed! Check your email.");
        setIsDone(true);
      } else {
        toast.error("Failed to subscribe. Try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-emerald-800">Subscribed!</p>
          <p className="text-xs text-emerald-600">Welcome email sent to {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {message && <p className="text-sm text-gray-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isLoading}
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="h-9 px-4 text-xs bg-cyan-500 hover:bg-cyan-600 rounded-lg"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
