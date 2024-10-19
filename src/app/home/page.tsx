"use client";
import { NextUIProvider } from "@nextui-org/react";
import { AppContext } from "../component/wallet/appContext";

export default function Home() {
    return (
        <NextUIProvider>
            <AppContext>
            </AppContext>
        </NextUIProvider>
    );
}
