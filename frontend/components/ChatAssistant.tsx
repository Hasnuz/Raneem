"use client";
import { useState } from "react";
import Link from "next/link";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I’m Raneem’s virtual assistant. How can I help with business setup, visas, PRO services or documents in the UAE?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "I want to start a company",
    "Which visa service do I need?",
    "How does document attestation work?",
    "How can I get a quotation?",
  ]);

  function toggle() {
    setOpen((current) => {
      if (!current) track("chat_open", "Website assistant");
      return !current;
    });
  }

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
  }

  async function sendMessage(value: string) {
    const content = value.trim();
    if (!content || loading) return;
    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setSuggestions([]);
    setLoading(true);
    track("chat_message", "Website assistant");
    try {
      const base =
        process.env.NEXT_PUBLIC_API_URL ||
        `http://${window.location.hostname}:4000/api/v1`;
      const response = await fetch(`${base}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        answer?: string;
        error?: string;
        suggestions?: string[];
      };
      if (!response.ok) throw new Error(result.error || "Chat unavailable");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer || "Please try again." },
      ]);
      setSuggestions(
        result.suggestions || [
          "Business setup options",
          "Visa services",
          "Document services",
        ],
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "The assistant is temporarily unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-[60] md:bottom-24 md:right-24">
      {open && (
        <section
          className="mb-3 flex h-[min(600px,calc(100svh-150px))] w-[min(380px,calc(100vw-28px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          aria-label="Raneem virtual assistant"
        >
          <header className="flex items-center gap-3 bg-navy px-4 py-4 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
              <Bot size={21} />
            </span>
            <div>
              <b className="block text-sm">Raneem Assistant</b>
              <span className="text-xs text-slate-300">
                Virtual service guide
              </span>
            </div>
            <button
              onClick={toggle}
              className="ml-auto rounded-lg p-2 hover:bg-white/10"
              aria-label="Close assistant"
            >
              <X size={19} />
            </button>
          </header>
          <div
            className="flex-1 space-y-3 overflow-y-auto bg-mist p-4"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-auto rounded-br-sm bg-navy text-white" : "rounded-bl-sm border bg-white text-slate-700"}`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-2xl border bg-white px-4 py-3 text-sm text-slate-500">
                Thinking…
              </div>
            )}
            {!loading && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-royal/20 bg-white px-3 py-2 text-left text-xs font-semibold text-royal transition hover:border-royal hover:bg-blue-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t px-3 py-2 text-xs">
            <Link href="/contact" className="font-bold text-royal">
              Enquiry form
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#167d52]"
            >
              WhatsApp
            </a>
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1500}
              placeholder="Ask about our services…"
              className="min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-royal"
              aria-label="Message"
            />
            <button
              disabled={!input.trim() || loading}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-white disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="px-4 pb-3 text-center text-[10px] text-slate-400">
            Automated service guide. Confirm case-specific requirements with our
            team.
          </p>
        </section>
      )}
      <button
        onClick={toggle}
        className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-royal text-white shadow-xl transition hover:scale-105"
        aria-expanded={open}
        aria-label={open ? "Close virtual assistant" : "Open virtual assistant"}
      >
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}
