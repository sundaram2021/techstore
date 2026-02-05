
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { data: session } = authClient.useSession();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
        }
    }, [session]);

    const updateProfile = async () => {
        setLoading(true);
        await authClient.updateUser({
            name: name
        }, {
            onSuccess: () => {
                setLoading(false);
                alert("Profile updated successfully");
                router.refresh();
            },
            onError: (ctx) => {
                setLoading(false);
                alert(ctx.error.message);
            }
        });
    };

    if (!session) {
        return null; // Or redirect
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your account details here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={session.user.email}
                            disabled
                            className="bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={updateProfile} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
