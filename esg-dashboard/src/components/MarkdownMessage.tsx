import ReactMarkdown from "react-markdown";

interface MarkdownMessageProps {
    content: string;
    sender: "user" | "bot";
}

export function MarkdownMessage({ content, sender }: MarkdownMessageProps) {
    return (
        <div className={sender === "user" ? "text-white" : "text-gray-900 dark:text-gray-200"}>
            {sender === "user" ? (
                content
            ) : (
                <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}
