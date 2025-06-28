"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ApiKeyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [apiKey, setApiKey] = React.useState("");

    const handleSaveKey = () => {
        if (apiKey.trim().length > 0) {
            sessionStorage.setItem("gemini-api-key", apiKey.trim());
            toast({
                title: "API Key Saved",
                description: "Your key has been saved for this session.",
            });
            router.push("/generate");
        } else {
            toast({
                variant: "destructive",
                title: "Invalid API Key",
                description: "Please enter a valid Gemini API key.",
            });
        }
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg">
                <Card className="shadow-2xl rounded-2xl shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center">
                            <KeyRound className="mr-3 text-primary" />
                            Enter Your Gemini API Key
                        </CardTitle>
                        <CardDescription>
                            To use this app, please provide your own Google Gemini API key.
                            It will only be stored in your browser for this session.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="api-key">Gemini API Key</Label>
                            <Input
                                id="api-key"
                                type="password"
                                placeholder="Enter your key here"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2 pt-2">
                            <p>
                                1. Get your API key from{" "}
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-primary"
                                >
                                    Google AI Studio
                                </a>.
                            </p>
                            <p>
                                2. Paste it above and click continue. Your key is not stored on our servers.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSaveKey}>
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
