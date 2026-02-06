"use client";

import { useRef, useEffect } from "react";
import { useTamboGenerationStage } from "@tambo-ai/react";
import { MessageBubble } from "./message-bubble";
import { GenerationIndicator } from "./generation-indicator";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string | Array<{ type: string; text?: string }>;
    renderedComponent?: React.ReactNode;
}

interface MessageListProps {
    messages: Message[];
    isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { generationStage } = useTamboGenerationStage();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, generationStage]);

    const parseContent = (content: string | Array<{ type: string; text?: string }>): string => {
        if (typeof content === "string") return content;
        return content
            .filter((part) => part.type === "text" && part.text)
            .map((part) => part.text)
            .join("");
    };

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
        >
            {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
                        <span className="text-2xl">👋</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Welcome to TechStore!</h4>
                    <p className="text-sm text-gray-500">
                        I&apos;m here to help you find the perfect tech products. Ask me anything!
                    </p>
                </div>
            )}

            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    role={message.role}
                    content={parseContent(message.content)}
                    renderedComponent={message.renderedComponent}
                />
            ))}

            {isLoading && <GenerationIndicator stage={generationStage} />}
        </div>
    );
}
