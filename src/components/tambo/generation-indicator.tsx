"use client";

import { Search, Cpu, Paintbrush, Loader2 } from "lucide-react";

interface GenerationIndicatorProps {
    stage?: string | null;
}

const stageConfig: Record<string, { icon: React.ReactNode; label: string }> = {
    thinking: { icon: <Cpu className="w-3.5 h-3.5" />, label: "Thinking…" },
    "choosing-component": { icon: <Paintbrush className="w-3.5 h-3.5" />, label: "Choosing UI…" },
    "generating-props": { icon: <Paintbrush className="w-3.5 h-3.5" />, label: "Building component…" },
    "calling-tool": { icon: <Search className="w-3.5 h-3.5" />, label: "Fetching data…" },
    streaming: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, label: "Streaming…" },
};

export function GenerationIndicator({ stage }: GenerationIndicatorProps) {
    const config = stage ? stageConfig[stage] : null;

    return (
        <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-2">
                {config ? (
                    <>
                        <span className="text-cyan-500">{config.icon}</span>
                        <span className="text-xs text-gray-600 font-medium">{config.label}</span>
                    </>
                ) : (
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                )}
            </div>
        </div>
    );
}
