"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { messageVariants } from "./animations";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    renderedComponent?: React.ReactNode;
}

export function MessageBubble({
    role,
    content,
    renderedComponent,
}: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className={cn("flex", isUser ? "justify-end" : "justify-start")}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    isUser
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                )}
            >
                {content &&
                    (isUser ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => (
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold">{children}</strong>
                                ),
                                em: ({ children }) => (
                                    <em className="italic">{children}</em>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc pl-4 space-y-1">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal pl-4 space-y-1">{children}</ol>
                                ),
                                li: ({ children }) => (
                                    <li className="leading-relaxed">{children}</li>
                                ),
                                a: ({ children, href }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-700 underline"
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    ))}
                {renderedComponent && <div className="mt-2">{renderedComponent}</div>}
            </div>
        </motion.div>
    );
}
