"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { STARTER_QUESTIONS } from "@/lib/agent-knowledge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "initial-assistant-greeting",
  role: "assistant",
  content:
    "Hi there! 👋 I'm **Apurv's AI representative**.\n\nI can answer questions about his **8+ years shipping enterprise Azure systems**, his **AI engineering projects**, architecture patterns, or how to get in touch.",
};

// Simple lightweight markdown formatter for chat bubbles
function FormattedText({ content }: { content: string }) {
  // Split by line breaks
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, lineIndex) => {
        if (!line.trim()) {
          return <div key={lineIndex} className="h-1" />;
        }

        // List item formatting
        const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
        const isNumbered = /^\d+\.\s/.test(line.trim());

        let cleanLine = line;
        if (isBullet) {
          cleanLine = line.trim().slice(2);
        } else if (isNumbered) {
          cleanLine = line.trim().replace(/^\d+\.\s/, "");
        }

        // Parse markdown inline: **bold**, [link](url), `code`
        const parts = [];
        const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\`.*?\`)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }

          const token = match[0];
          if (token.startsWith("**") && token.endsWith("**")) {
            parts.push(
              <strong key={match.index} className="font-semibold text-foreground">
                {token.slice(2, -2)}
              </strong>,
            );
          } else if (token.startsWith("[") && token.includes("](")) {
            const linkText = token.slice(1, token.indexOf("]("));
            const linkHref = token.slice(token.indexOf("](") + 2, -1);
            parts.push(
              <a
                key={match.index}
                href={linkHref}
                target={linkHref.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                {linkText}
              </a>,
            );
          } else if (token.startsWith("`") && token.endsWith("`")) {
            parts.push(
              <code
                key={match.index}
                className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-primary"
              >
                {token.slice(1, -1)}
              </code>,
            );
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div>{parts}</div>
            </div>
          );
        }

        if (isNumbered) {
          const matchNum = line.trim().match(/^(\d+)\./);
          const num = matchNum ? matchNum[1] : "1";
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-2">
              <span className="font-semibold text-primary text-xs shrink-0 mt-0.5">
                {num}.
              </span>
              <div>{parts}</div>
            </div>
          );
        }

        return <p key={lineIndex}>{parts}</p>;
      })}
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Send message handler
  const handleSend = async (userText: string) => {
    const text = userText.trim();
    if (!text || isLoading) return;

    setInput("");
    setHasPrompted(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages([...newHistory, initialAssistantMsg]);

    try {
      // Send chat history to streaming route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to fetch response.");
      }

      if (!response.body) {
        throw new Error("No response stream received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedContent }
              : msg,
          ),
        );
      }
    } catch (err: unknown) {
      console.error("[Chat Stream Error]", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Sorry, I ran into an error generating that response. Please try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: errorMessage }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setHasPrompted(false);
    setInput("");
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <div className="group relative flex items-center">
            {/* Tooltip hint on hover */}
            <div className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur border border-border sm:block pointer-events-none transition-opacity duration-200">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary animate-pulse" />
                Ask Apurv&apos;s AI Agent
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Assistant"
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Avatar Inside Button */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 bg-white">
                <Image
                  src="/icon.svg"
                  alt="Apurv Singhal AI"
                  width={40}
                  height={40}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Online pulse indicator */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Chat Modal / Slide-over */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-modal-title"
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] z-50 flex flex-col overflow-hidden rounded-none sm:rounded-2xl border border-black/10 dark:border-white/10 bg-background/95 backdrop-blur-2xl shadow-2xl shadow-black/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-black/10 dark:border-white/20 bg-white shadow-sm">
                <Image
                  src="/icon.svg"
                  alt="Apurv Singhal"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 id="chat-modal-title" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  Apurv&apos;s AI Agent
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grounded on 8+ years enterprise & AI work
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!isUser && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted/70 text-foreground border border-border/50 rounded-tl-none"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    ) : (
                      <FormattedText content={msg.content} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-muted/70 px-4 py-3 border border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Starters (shown initially before conversation starts) */}
            {!hasPrompted && messages.length <= 1 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary" />
                  Suggested questions:
                </p>
                <div className="flex flex-col gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="text-left rounded-xl border border-border/80 bg-background/60 hover:bg-primary/5 hover:border-primary/40 px-3.5 py-2 text-xs text-foreground transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="border-t border-border p-3 bg-muted/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Apurv's experience or projects..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-40 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Powered by Gemini & RAG</span>
              <span>100% Free · Real-time inference</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
