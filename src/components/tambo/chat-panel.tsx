"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
    useTamboThread,
    useTamboThreadInput,
    useTamboSuggestions,
} from "@tambo-ai/react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { SuggestedActions } from "./suggested-actions";
import { panelVariants } from "./animations";
import type { SuggestedAction } from "./types";
import { authClient } from "@/lib/auth-client";

const ChatInput = dynamic(
    () => import("./chat-input").then((mod) => mod.ChatInput),
    { ssr: false, loading: () => null },
);

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
    const router = useRouter();
    const { thread, sendThreadMessage } = useTamboThread();
    const { isPending } = useTamboThreadInput();
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNewChat, setIsNewChat] = useState(false);
    const { data: session, isPending: sessionLoading } = authClient.useSession();

    // Dynamic AI-generated suggestions after each response
    const { suggestions, isPending: suggestionsLoading } =
        useTamboSuggestions();

    const busy = isPending || isSending;

    const handleSend = useCallback(
        async (message: string) => {
            const trimmed = message.trim();
            if (!trimmed || busy) return;

            setInputValue("");
            setIsSending(true);

            try {
                const threadId = isNewChat ? undefined : thread?.id;
                await sendThreadMessage(trimmed, {
                    threadId,
                    streamResponse: true,
                });
            } catch (error) {
                console.error("Failed to send message:", error);
            } finally {
                setIsSending(false);
                setIsNewChat(false);
            }
        },
        [busy, isNewChat, sendThreadMessage, thread?.id],
    );

    const handleSuggestedAction = useCallback(
        (prompt: string) => {
            handleSend(prompt);
        },
        [handleSend],
    );

    const handleNewChat = useCallback(() => {
        setIsNewChat(true);
        setInputValue("");
    }, []);

    // Filter messages to only show user and assistant messages
    const allMessages = thread?.messages || [];
    const messages = isNewChat
        ? []
        : allMessages
              .filter((msg) => msg.role === "user" || msg.role === "assistant")
              .map((msg) => ({
                  ...msg,
                  role: msg.role as "user" | "assistant",
              }));

    const showInitialSuggestions = messages.length === 0 && !busy;

    // Build dynamic suggestion actions from Tambo AI suggestions
    const dynamicSuggestionActions: SuggestedAction[] =
        (suggestions ?? []).map((s) => ({
            label: s.title || s.detailedSuggestion?.slice(0, 40) || "Suggestion",
            prompt: s.detailedSuggestion || s.title || "",
        }));

    const showDynamicSuggestions =
        !showInitialSuggestions &&
        !busy &&
        !suggestionsLoading &&
        dynamicSuggestionActions.length > 0;

    const showAuthGate = !session && !sessionLoading;

    const handleSignIn = useCallback(() => {
        onClose();
        router.push("/sign-in");
    }, [onClose, router]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed z-50
                     bottom-20 right-4 sm:bottom-24 sm:right-6
                     w-[calc(100vw-32px)] sm:w-[380px]
                     h-[min(70vh,520px)] sm:h-[520px]
                     bg-white/95 backdrop-blur-xl
                     rounded-2xl shadow-2xl shadow-black/10
                     border border-gray-200/50
                     flex flex-col overflow-hidden"
                    style={{
                        maxWidth: "calc(100vw - 32px)",
                    }}
                >
                    <ChatHeader onClose={onClose} onNewChat={handleNewChat} />

                    {showAuthGate ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                            <div className="text-sm font-medium text-gray-900">
                                Please sign in to use ShopMate AI.
                            </div>
                            <div className="text-xs text-gray-500">
                                Once signed in, I can help you browse products and manage your cart.
                            </div>
                            <button
                                type="button"
                                onClick={handleSignIn}
                                className="mt-1 inline-flex items-center justify-center rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors"
                            >
                                Go to sign in
                            </button>
                        </div>
                    ) : (
                        <>
                            <MessageList messages={messages} isLoading={busy} />

                            {showInitialSuggestions && (
                                <SuggestedActions onSelect={handleSuggestedAction} />
                            )}

                            {showDynamicSuggestions && (
                                <SuggestedActions
                                    onSelect={handleSuggestedAction}
                                    actions={dynamicSuggestionActions}
                                />
                            )}

                            <ChatInput
                                value={inputValue}
                                onChange={setInputValue}
                                onSend={handleSend}
                                disabled={busy}
                            />
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
