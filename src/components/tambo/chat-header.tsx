"use client";

import { X, Sparkles, Plus } from "lucide-react";
import Image from "next/image";
import tamboPng from "../../../public/tambo.png";

interface ChatHeaderProps {
    onClose: () => void;
    onNewChat: () => void;
}

export function ChatHeader({ onClose, onNewChat }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                        src={tamboPng}
                        alt="ShopMate AI"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                        ShopMate AI
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    </h3>
                    <p className="text-xs text-gray-500">Your shopping assistant</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onNewChat}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="New chat"
                    title="Start new chat"
                >
                    <Plus className="w-5 h-5 text-gray-500" />
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close chat"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </div>
    );
}
