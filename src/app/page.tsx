"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef,  } from "react";
import { AppContext } from "./component/wallet/appContext";
import { useAccount } from "wagmi";

export default function Page() {
    const router = useRouter();
    const ref = useRef<any>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.width = `${ref.current.scrollWidth + 10}px`;
        }
    }, []);

    const { isConnected } = useAccount();

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
            </AppContext>
        </NextUIProvider>
    );
}
