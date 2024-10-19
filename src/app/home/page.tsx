"use client";
import { NextUIProvider } from "@nextui-org/react";
import AGIGitCore from "../component/AGIGitCore";
import { AppContext } from "../component/wallet/appContext";

export default function Home() {
    return (
        <NextUIProvider>
            <AppContext>
                <AGIGitCore />
            </AppContext>
        </NextUIProvider>
    );
}
