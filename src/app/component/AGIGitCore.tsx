"use client";

import * as React from "react";
import { Github, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "../util/localStorage";
import { Editor } from "@monaco-editor/react";
import { registerAGIGit } from "../util/registerAGIGit";
import DescriptionCard from "./descriptionCard";
import { Progress } from "@nextui-org/react";
import TransferCard from "./transferCard";
import { Contract } from "ethers";
import { contractAddress } from "../constant/contractAddress";
import ABI from "../constant/ABI.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

interface commandResult {
    type: string | "add" | "remove" | "pull" | "push" | null;
    relayHash: string;
}

function parsingCommand(command: string) {
    let result: commandResult = {
        type: null,
        relayHash: "",
    };
    const subStrList = [
        {
            substr: "agigit relay add",
            getResult: (command: string) => {
                const list = command.split(" ");
                return {
                    type: "add",
                    relayHash: list[list.length - 1],
                };
            },
        },
        {
            substr: "agigit relay remove",
            getResult: () => {
                return {
                    type: "remove",
                    relayHash: "",
                };
            },
        },
        {
            substr: "agigit pull",
            getResult: () => {
                return {
                    type: "pull",
                };
            },
        },
        {
            substr: "agigit push",
            getResult: () => {
                return {
                    type: "push",
                };
            },
        },
    ];
    for (let item of subStrList) {
        if (command.toLocaleLowerCase().includes(item.substr)) {
            result = {
                ...result,
                ...item.getResult(command.toLocaleLowerCase()),
            };
            console.log(result);
            break;
        } else {
            console.log("error command!");
        }
    }
    return result;
}

export default function AGIGitCore() {
    const [command, setCommand] = React.useState("");
    const [editorValue, setEditorValue] = React.useState<string | undefined>("");
    const [recordList, setRecordList] = React.useState<any>([]);
    const [result, setResult] = React.useState<commandResult>();
    const [pullCardDom, setPullCardDom] = React.useState<any>();
    const [pushCardDom, setPushCardDom] = React.useState<any>();
    const relayHashRef = React.useRef("");
    const pontemProviderRef = React.useRef<any>(null);
    let contract = React.useRef<any>(null);
    const router = useRouter();

    const { isConnected } = useAccount();
    console.log({ isConnected });
    useEffect(() => {
        if (isConnected) {
            void router.push("/home");
        } else {
            router.push("/");
        }
    }, [isConnected, router]);

    useEffect(() => {
        if ((window as any).pontem) {
            pontemProviderRef.current = (window as any).pontem;
            contract.current = new Contract(contractAddress, ABI, pontemProviderRef.current);
        }
    }, []);

    const handleEditorChange = (value: string | undefined) => {
        setEditorValue(value);
    };

    useEffect(() => {
        const list = getLocalStorage("record") ?? [];
        setRecordList(list);
    }, []);

    useEffect(() => {
        const value = parsingCommand(command);
        if (value.type !== "add" && value.type !== "remove") {
            value.relayHash = relayHashRef.current;
        }
        setResult(value);
    }, [command]);

    const handleRunCommand = () => {
        if ((editorValue ?? "").length > 0) {
            setCommand(editorValue!);
            const list = [editorValue, ...recordList];
            setRecordList(list);
            setEditorValue("");
            setLocalStorage("record", list);
        }
    };

    const contractOfPull = () => {
        setPullCardDom(<Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md my-auto" />);
        const timer = setTimeout(() => {
            const extraData = {
                from: "1J93t4tZ76hX9i3Qd7aR4yY3F4iGqG6z8z7gPN8oQe",
                to: "3A3gYZFopmTK1bSVLwsMQDntWQTZARfNXq",
                gas: "0.002",
            };
            setPullCardDom(<TransferCard key="pull" result={result} extraData={extraData} />);
        }, 3000);
    };

    const contractOfPush = () => {
        setPushCardDom(<Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md my-auto" />);
        const timer = setTimeout(() => {
            const extraData = {
                from: "1J93t4tZ76hX9i3Qd7aR4yY3F4iGqG6z8z7gPN8oQe",
                to: "3A3gYZFopmTK1bSVLwsMQDntWQTZARfNXq",
                gas: "0.003821564",
            };
            setPushCardDom(<TransferCard key="push" result={result} extraData={extraData} />);
        }, 3000);
    };

    useEffect(() => {
        if (result?.type === "add") {
            relayHashRef.current = result.relayHash;
        }
        if (result?.type === "remove") {
            relayHashRef.current = "";
        }
        if (result?.type === "pull") {
            contractOfPull();
        }
        if (result?.type === "push") {
            contractOfPush();
        }
    }, [result]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 text-gray-100">
            <header className="flex items-center justify-between p-6 bg-opacity-30 bg-black backdrop-blur-md">
                <div className="flex items-center space-x-4">
                    <Github className="w-8 h-8" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">AGI-GIT</h1>
                    <CardTitle className="text-xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                        Facilitating seamless collaboration in AGI training
                    </CardTitle>
                </div>
                <div className="flex items-center space-x-4">
                    <ConnectButton />
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6">
                <Card className="bg-opacity-10 bg-white backdrop-blur-lg border-0 shadow-lg">
                    <CardContent className="flex flex-col lg:flex-row gap-6">
                        <div className="w-[80%] space-y-4">
                            <Editor height="40vh" className="w-full" defaultLanguage="AGIGit" value={editorValue} theme="AGIGitTheme" onMount={registerAGIGit} onChange={handleEditorChange} />
                            <Button onClick={handleRunCommand} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                <Play className="w-4 h-4 mr-2" /> Run
                            </Button>
                        </div>
                        <Card className="flex-1 lg:w-80 bg-opacity-10 bg-white backdrop-blur-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Recommended Instructions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>1. agigit relay add</li>
                                    <li>2. agigit relay remove</li>
                                    <li>3. agigit pull</li>
                                    <li>4. agigit push</li>
                                </ul>
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">History Record</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-40">
                                    <ul className="space-y-2 text-sm">
                                        {recordList.map((item: any, index: any) => (
                                            <li key={index} className="opacity-80 hover:opacity-100 transition-opacity">{`${index + 1}: ${item}`}</li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-row px-6 w-full">
                            {result?.relayHash && <DescriptionCard key="add" {...result} />}
                            {pullCardDom}
                            {pushCardDom}
                        </div>
                        {/* <Card className="flex-1 bg-opacity-10 bg-white backdrop-blur-lg border-0">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">AGIGit pull</CardTitle>
                                <ArrowDownCircle className="w-4 h-4 text-blue-400" />
                            </CardHeader>
                            <CardContent className="text-xs">
                                <div className="flex justify-between">
                                    <span>You</span>
                                    <span>wait</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>1J93...800e</span>
                                    <span>3A3g...fNXN</span>
                                </div>
                                <div className="text-right text-blue-400">0.002 USDT</div>
                                <div className="text-right text-gray-400">Gas</div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 bg-opacity-10 bg-white backdrop-blur-lg border-0">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">AGIGit push</CardTitle>
                                <ArrowUpCircle className="w-4 h-4 text-purple-400" />
                            </CardHeader>
                            <CardContent className="text-xs">
                                <div className="flex justify-between">
                                    <span>You</span>
                                    <span>wait</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>1J93...800e</span>
                                    <span>3A3g...fNXN</span>
                                </div>
                                <div className="text-right text-purple-400">0.003821564 USDT</div>
                                <div className="text-right text-gray-400">Gas</div>
                            </CardContent>
                        </Card> */}
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
