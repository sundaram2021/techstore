"use client";

import { useMemo } from "react";
import { TamboProvider as TamboSDKProvider } from "@tambo-ai/react";
import { tamboComponents } from "./component-registry";
import { tamboTools } from "./tools";
import { createContextHelpers } from "./context-helpers";

interface TamboWrapperProps {
    children: React.ReactNode;
}

export function TamboWrapper({ children }: TamboWrapperProps) {
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    const contextHelpers = useMemo(() => createContextHelpers(), []);

    if (!apiKey) {
        console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set. Tambo features will not work.");
        return <>{children}</>;
    }

    return (
        <TamboSDKProvider
            apiKey={apiKey}
            components={tamboComponents}
            tools={tamboTools}
            contextHelpers={contextHelpers}
        >
            {children}
        </TamboSDKProvider>
    );
}
