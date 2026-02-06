"use client";

import { KeyboardEvent, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { useTamboVoice } from "@tambo-ai/react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Ask me anything...",
}: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const {
        startRecording,
        stopRecording,
        isRecording,
        isTranscribing,
        transcript,
        transcriptionError,
        mediaAccessError,
    } = useTamboVoice();

    // When transcript is ready, put it in the input
    useEffect(() => {
        if (transcript) {
            onChange(transcript);
        }
    }, [transcript, onChange]);

    const handleSend = () => {
        const trimmed = value.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const voiceError = transcriptionError || mediaAccessError;

    return (
        <div className="p-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
            {voiceError && (
                <p className="text-xs text-red-500 mb-1 px-1">{voiceError}</p>
            )}
            <div className="flex items-end gap-2">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        isRecording
                            ? "Listening..."
                            : isTranscribing
                              ? "Transcribing..."
                              : placeholder
                    }
                    disabled={disabled || isRecording || isTranscribing}
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5
                     text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2
                     focus:ring-cyan-400 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     max-h-24 overflow-y-auto"
                    style={{ minHeight: "42px" }}
                />

                {/* Voice input button */}
                <button
                    onClick={handleVoiceToggle}
                    disabled={disabled || isTranscribing}
                    className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                        isRecording
                            ? "bg-red-500 text-white shadow-md shadow-red-500/20 animate-pulse"
                            : isTranscribing
                              ? "bg-gray-200 text-gray-500 cursor-wait"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start voice input"}
                    title={isRecording ? "Stop recording" : "Voice input"}
                >
                    {isTranscribing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isRecording ? (
                        <MicOff className="w-4 h-4" />
                    ) : (
                        <Mic className="w-4 h-4" />
                    )}
                </button>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled || !value.trim() || isRecording || isTranscribing}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500
                     text-white shadow-md shadow-cyan-500/20
                     hover:from-cyan-600 hover:to-teal-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex-shrink-0"
                    aria-label="Send message"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
