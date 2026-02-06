
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { onStoreEvent, type StoreEvent } from "@/lib/store-events";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Sync name from session
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
        }
    }, [session]);

    // Listen for real-time profile updates from Tambo AI
    useEffect(() => {
        return onStoreEvent((event: StoreEvent) => {
            if (event.type === "profile" && event.payload?.name) {
                setName(event.payload.name as string);
            }
        });
    }, []);

    const updateProfile = async () => {
        setLoading(true);
        await authClient.updateUser({
            name: name
        }, {
            onSuccess: () => {
                setLoading(false);
                toast.success("Profile updated successfully");
                router.refresh();
            },
            onError: (ctx) => {
                setLoading(false);
                toast.error(ctx.error.message);
            }
        });
    };

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl" data-highlight="settings-page">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Profile Information
                        <Sparkles className="w-4 h-4 text-cyan-500" />
                    </CardTitle>
                    <CardDescription>
                        Update your account details here, or ask ShopMate AI to do it for you.
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
                        <p className="text-xs text-gray-400">
                            Tip: You can say &quot;Change my name to ...&quot; in the AI chat.
                        </p>
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
