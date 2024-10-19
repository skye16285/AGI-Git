"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppContext } from "./component/wallet/appContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Github } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const ref = useRef<any>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.width = `${ref.current.scrollWidth + 10}px`;
        }
    }, []);

    const { isConnected } = useAccount();
    console.log({ isConnected });
    useEffect(() => {
        if (isConnected) {
            void router.push("/home");
        } else {
            router.push("/");
        }
    }, [isConnected, router]);

    return (
        <NextUIProvider>
            <AppContext>
                <div className={`round-lg bg-[url("/login-bg.webp")] bg-cover bg-center bg-no-repeat h-[100vh] items-center justify-center flex`}>
                    <div className="flex flex-col items-center">
                        <div className="text-[#fff] text-8xl mb-16 type-writer flex item-center font-bold" ref={ref}>
                            AGI-Git
                        </div>
                        <ConnectButton />
                    </div>
                </div>
            </AppContext>
        </NextUIProvider>
    );
}
