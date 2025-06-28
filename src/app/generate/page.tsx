"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Linkedin, Copy, Bot, Loader2, Send, Check, Heart, CalendarPlus, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateXPost } from "@/ai/flows/generate-x-post";
import { generateLinkedInPost } from "@/ai/flows/generate-linkedin-post";
import { generatePreEventPost } from "@/ai/flows/generate-pre-event-post";
import { XIcon } from "@/components/icons/x-icon";


const preEventSchema = z.object({
    postType: z.literal('preevent'),
    platform: z.enum(['linkedin', 'x']),
    postLength: z.enum(['medium', 'long']),
    previousExperience: z.string().max(1000, "Your summary is too long (max 1000 characters).").optional(),
});

const postEventSchema = z.object({
    postType: z.literal('postevent'),
    platform: z.enum(['linkedin', 'x']),
    postLength: z.enum(['medium', 'long']),
    experience: z.string()
        .min(20, "Please share a bit more (at least 20 characters).")
        .max(1000, "Your summary is too long (max 1000 characters)."),
    workshop: z.string({ required_error: "Please select a workshop." })
        .min(1, "Please select a workshop."),
});

const formSchema = z.discriminatedUnion("postType", [
    preEventSchema,
    postEventSchema,
]);


const WORKSHOPS = [
    { name: "Intro to Multimodal Retrieval-Augmented Generation (RAG)", speaker: "Harsh Manvar" },
    { name: "Building the Next Wave: Agentic AI with Google ADK & MCP", speaker: "Abhishek Sharma" },
    { name: "The Invisible Co-Founder: How to launch and run a Startup with an AI agent", speaker: "Parth Devariya" },
    { name: "Build Your Social Media Brain: Content Creation with Google ADK Agents", speaker: "Geeta Kakrani" },
];

const EVENT_DETAILS = `Cloud Community Days 2025 in Rajkot, organized by GDG Cloud Rajkot. A full-day tech event with sessions and workshops.
Key Sessions:
- Welcome Note by Dhaval K
- Google Cloud AI by Rushabh Vasa
- MCP 101 by Shreyan Mehta
The event also includes parallel workshops on various tech topics.`;

export default function GeneratorPage() {
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        const apiKey = sessionStorage.getItem("gemini-api-key");
        if (!apiKey) {
            toast({
                title: "API Key Required",
                description: "Please enter your Gemini API key to continue.",
                variant: "destructive",
            });
            router.replace("/");
        }
    }, [router, toast]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [generatedPost, setGeneratedPost] = React.useState("");
    const [isCopied, setIsCopied] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postType: "postevent",
            platform: "linkedin",
            postLength: "medium",
            experience: "",
            workshop: undefined,
        },
    });

    const postType = form.watch("postType");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const apiKey = sessionStorage.getItem("gemini-api-key");
        if (!apiKey) {
            toast({
                title: "API Key Not Found",
                description: "Your session may have expired. Please re-enter your API key.",
                variant: "destructive"
            });
            router.push("/");
            return;
        }

        setIsLoading(true);
        setGeneratedPost("");
        setIsCopied(false);

        try {
            let result;
            if (values.postType === 'preevent') {
                result = await generatePreEventPost({
                    platform: values.platform,
                    postLength: values.postLength,
                    previousExperience: values.previousExperience,
                    apiKey: apiKey,
                });
                setGeneratedPost(result.post);
            } else {
                const selectedWorkshop = WORKSHOPS.find(w => w.name === values.workshop);

                if (values.platform === "x") {
                    result = await generateXPost({
                        eventDetails: EVENT_DETAILS,
                        experienceDetails: values.experience,
                        postLength: values.postLength,
                        workshop: values.workshop,
                        speaker: selectedWorkshop?.speaker,
                        apiKey: apiKey,
                    });
                    setGeneratedPost(result.xPost);
                } else {
                    result = await generateLinkedInPost({
                        eventDetails: EVENT_DETAILS,
                        experienceDetails: values.experience,
                        postLength: values.postLength,
                        workshop: values.workshop,
                        speaker: selectedWorkshop?.speaker,
                        apiKey: apiKey,
                    });
                    setGeneratedPost(result.post);
                }
            }
        } catch (error) {
            console.error("Error generating post:", error);
            toast({
                variant: "destructive",
                title: "Failed to Generate Post",
                description: "There was a problem generating your post. This might be due to an invalid API key or a network issue. Please check your key and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCopy = () => {
        if (generatedPost) {
            navigator.clipboard.writeText(generatedPost);
            setIsCopied(true);
            toast({
                title: "Copied to clipboard!",
                description: "Your post is ready to be shared.",
            });
            setTimeout(() => setIsCopied(false), 3000);
        }
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        CCD 2025 Post Generator
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Create unique, AI-generated social media posts for your Cloud Community Days 2025 journey.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 lg:gap-16">
                    <div className="lg:pr-8">
                        <Card className="w-full shadow-2xl rounded-2xl shadow-primary/10">
                            <CardHeader>
                                <CardTitle className="text-2xl">Create Your Social Post</CardTitle>
                                <CardDescription>
                                    Tell us about your event journey. We&apos;ll craft the perfect post.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="postType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Tabs
                                                            defaultValue={field.value}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                form.clearErrors();
                                                            }}
                                                            className="w-full"
                                                        >
                                                            <TabsList className="grid w-full grid-cols-2">
                                                                <TabsTrigger value="postevent">
                                                                    <MessageSquareText className="mr-2 h-4 w-4" />
                                                                    Post-Event
                                                                </TabsTrigger>
                                                                <TabsTrigger value="preevent">
                                                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                                                    Pre-Event
                                                                </TabsTrigger>
                                                            </TabsList>
                                                        </Tabs>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="platform"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <FormLabel>Choose a platform</FormLabel>
                                                    <FormControl>
                                                        <Tabs
                                                            defaultValue={field.value}
                                                            onValueChange={field.onChange}
                                                            className="w-full"
                                                        >
                                                            <TabsList className="grid w-full grid-cols-2">
                                                                <TabsTrigger value="linkedin">
                                                                    <Linkedin className="mr-2 h-4 w-4" />
                                                                    LinkedIn
                                                                </TabsTrigger>
                                                                <TabsTrigger value="x">
                                                                    <XIcon className="mr-2 h-4 w-4" />X (Twitter)
                                                                </TabsTrigger>
                                                            </TabsList>
                                                        </Tabs>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {postType === 'postevent' ? (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="workshop"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Highlight a Session or Workshop</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a session you attended" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {WORKSHOPS.map((workshop) => (
                                                                        <SelectItem key={workshop.name} value={workshop.name}>
                                                                            {workshop.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="experience"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Your Experience</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="What did you learn? Who did you meet? What was your favorite part of the event?"
                                                                    className="resize-none min-h-[120px]"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name="previousExperience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Previous Experience (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Attended before? Share a favorite memory to add a personal touch!"
                                                                className="resize-none min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="postLength"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Post Length</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select post length" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="long">Long</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="mr-2 h-4 w-4" />
                                            )}
                                            Generate Post
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-12 lg:mt-0 flex flex-col justify-center items-center">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center space-y-4 text-center w-full h-full rounded-2xl bg-muted/50 p-8 animate-pulse">
                                <Bot className="h-16 w-16 text-primary animate-bounce" />
                                <p className="text-xl font-semibold text-primary">
                                    Crafting your post...
                                </p>
                                <p className="text-muted-foreground">
                                    Our AI is thinking hard to make it perfect.
                                </p>
                            </div>
                        ) : generatedPost ? (
                            <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-8 duration-700 w-full">
                                <h3 className="text-xl font-semibold flex items-center">
                                    <Bot className="mr-3 h-6 w-6 text-primary" />
                                    Your Generated Post
                                </h3>
                                <Card className="bg-card border-dashed shadow-lg rounded-2xl">
                                    <CardContent className="p-6">
                                        <p className="whitespace-pre-wrap text-base text-foreground/90">
                                            {generatedPost}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="ml-auto rounded-full"
                                        >
                                            {isCopied ? (
                                                <Check className="mr-2 h-4 w-4 text-accent" />
                                            ) : (
                                                <Copy className="mr-2 h-4 w-4" />
                                            )}
                                            {isCopied ? "Copied!" : "Copy Post"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center w-full h-full rounded-2xl bg-muted/50 p-8 border-2 border-dashed">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <Bot className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Awaiting Your Brilliance</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    Fill out the form on the left, and your masterpiece will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <footer className="text-center mt-16">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                    Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> by GDG Cloud Rajkot
                </p>
            </footer>
        </main>
    );
}
