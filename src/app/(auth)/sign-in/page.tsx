
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const signIn = async () => {
        setLoading(true);
        await authClient.signIn.email(
            {
                email,
                password,
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: () => {
                    router.push("/");
                    setLoading(false);
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                    setLoading(false);
                },
            }
        );
    };

    const signInGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="m@example.com"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-sm underline text-gray-500 hover:text-gray-900">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={signIn} disabled={loading} isLoading={loading}>
                        Login
                    </Button>
                    <Button variant="outline" className="w-full" onClick={signInGoogle}>
                        Login with Google
                    </Button>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="underline text-gray-900">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
