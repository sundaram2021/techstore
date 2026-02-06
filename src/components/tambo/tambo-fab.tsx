"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TamboThreadProvider } from "@tambo-ai/react";
import { authClient } from "@/lib/auth-client";
import { FabButton } from "./fab-button";
import { ChatPanel } from "./chat-panel";

export function TamboFab() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session) {
            setIsOpen(false);
        }
    }, [session]);

    const toggle = () => {
        if (!session) {
            // Unauthenticated user — redirect to sign-in
            router.push("/sign-in");
            return;
        }
        setIsOpen((prev) => !prev);
    };
    const close = () => setIsOpen(false);

    return (
        <TamboThreadProvider>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                <ChatPanel isOpen={isOpen} onClose={close} />
                <FabButton isOpen={isOpen} onClick={toggle} />
            </div>
        </TamboThreadProvider>
    );
}
