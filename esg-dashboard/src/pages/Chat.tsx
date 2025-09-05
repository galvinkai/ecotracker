import { MarkdownMessage } from "@/components/MarkdownMessage";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { esgApi } from "@/services/api";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Message {
    id: number;
    content: string;
    sender: "user" | "bot";
}

interface FormData {
    good_used: string;
    "quantity_used (tons)": string;
    "carbon_emission (tons CO2)": string;
    "water_usage (liters)": string;
    "waste_generated (tons)": string;
    prediction: "High" | "Low";
    recommendation: string;
}

const INITIAL_MESSAGE = {
    id: 0,
    content:
        "Hello! I'm your ESG Agent. I can help you analyse your ESG metrics and provide insights. What would you like to know about your recommendation?",
    sender: "bot" as const,
};

export default function Chat() {
    const location = useLocation();
    const formData = location.state?.formData as FormData | undefined;
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Load messages from localStorage or use initial message
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        return savedMessages ? JSON.parse(savedMessages) : [INITIAL_MESSAGE];
    });

    // Add effect to simulate page load and handle initial setup
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    // Reset chat when leaving the page
    useEffect(() => {
        return () => {
            localStorage.removeItem("chatMessages");
        };
    }, []);

    // Add logging to debug the received data
    console.log("Received form data:", formData);

    console.log("Chat", messages);

    // Scroll when messages change or loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Get the next message ID by using the current length + 1
        const nextMessageId = messages.length + 1;

        const userMessage = {
            id: nextMessageId,
            content: input.trim(),
            sender: "user" as const,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await esgApi.chat(userMessage.content);
            const botMessages = response.response
                .filter((msg: { role: string; content: string }) => msg.role === "assistant")
                .map((msg: { role: string; content: string }, index: number) => ({
                    // Calculate bot message IDs based on the nextMessageId
                    id: nextMessageId + 1 + index,
                    content: msg.content,
                    sender: "bot" as const,
                }));

            setMessages((prev) => [...prev, ...botMessages]);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to get response");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPageLoading) {
        return <PageLoader />;
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Left side - Metrics Card */}
            {formData && (
                <Card className="w-full lg:max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-400">ESG Analysis Results</CardTitle>
                        <CardDescription className="dark:text-gray-300">Production metrics and impact assessment</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="text-sm font-medium dark:text-gray-200">Material Used</div>
                            <div className="font-semibold text-green-600 dark:text-green-400">{formData.good_used}</div>
                        </div>
                        <div className="grid gap-2">
                            <div className="text-sm font-medium dark:text-gray-200">Quantity Used</div>
                            <div className="dark:text-gray-300">{formData["quantity_used (tons)"]} tons</div>
                        </div>
                        <div className="grid gap-2">
                            <div className="text-sm font-medium dark:text-gray-200">Carbon Emissions</div>
                            <div className="dark:text-gray-300">{formData["carbon_emission (tons CO2)"]} tons CO2</div>
                        </div>
                        <div className="grid gap-2">
                            <div className="text-sm font-medium dark:text-gray-200">Water Usage</div>
                            <div className="dark:text-gray-300">{formData["water_usage (liters)"]} liters</div>
                        </div>
                        <div className="grid gap-2">
                            <div className="text-sm font-medium dark:text-gray-200">Waste Generated</div>
                            <div className="dark:text-gray-300">{formData["waste_generated (tons)"]} tons</div>
                        </div>
                        <div className="grid gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="text-sm font-medium dark:text-gray-200">Environmental Impact</div>
                            <div
                                className={`font-semibold ${formData.prediction === "High" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                            >
                                {formData.prediction} Impact
                            </div>
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <div className="text-sm font-medium dark:text-gray-200">Recommendation</div>
                                <div className="text-gray-700 dark:text-gray-300">{formData.recommendation}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Right side - Chat */}
            <Card className="flex w-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle className="text-green-700">Chat with ESG Agent</CardTitle>
                    <CardDescription>Ask questions about your ESG reports and data</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <div className="h-[calc(100vh-20rem)] overflow-y-auto pr-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                        message.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
                                    }`}
                                >
                                    <MarkdownMessage content={message.content} sender={message.sender} />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mb-4 flex justify-start">
                                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                    <span className="text-sm dark:text-gray-200">ESG Agent is typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSubmit} className="flex w-full gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="focus-visible:ring-green-600"
                        />
                        <Button type="submit" size="icon" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
