"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fabVariants, fabIconVariants, pulseKeyframes, pulseTransition } from "./animations";
import tamboPng from "../../../public/tambo.png";

interface FabButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export function FabButton({ isOpen, onClick }: FabButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full 
                 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600
                 shadow-lg shadow-cyan-500/30 border-2 border-white/20
                 flex items-center justify-center overflow-hidden
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            variants={fabVariants}
            initial="idle"
            animate={isOpen ? "hover" : "idle"}
            whileHover="hover"
            whileTap="tap"
            aria-label={isOpen ? "Close chat" : "Open ShopMate AI assistant"}
        >
            {/* Pulse ring effect when closed */}
            {!isOpen && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-cyan-400"
                    animate={pulseKeyframes}
                    transition={pulseTransition}
                />
            )}

            {/* Mascot image with rotation */}
            <motion.div
                variants={fabIconVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
            >
                <Image
                    src={tamboPng}
                    alt="ShopMate AI"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain drop-shadow-md"
                    priority
                />
            </motion.div>

            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        </motion.button>
    );
}
