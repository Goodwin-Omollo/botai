"use client";

import { CoreMessage } from "ai";
import { useState } from "react";
import { Input } from "@/components/ui/input";

// user: I want to know about my german sheperd training? ---- query
// query (UI) ---> api--> PDF(unajua anything about {query})--- {RAG}
// {RAG} ---> {RAG} ---llm(openai-gpt-40-mini)---> answer

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  return (
    <div>
      <Input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            setMessages((currentMessages) => [
              ...currentMessages,
              { role: "user", content: input },
            ]);

            const response = await fetch("/api/chat", {
              method: "POST",
              body: JSON.stringify({
                messages: [...messages, { role: "user", content: input }],
              }),
            });

            const { messages: newMessages } = await response.json();

            setMessages((currentMessages) => [
              ...currentMessages,
              ...newMessages,
            ]);
          }
        }}
      />

      {messages.map((message, index) => (
        <div key={`${message.role}-${index}`}>
          {typeof message.content === "string"
            ? message.content
            : message.content
                .filter((part) => part.type === "text")
                .map((part, partIndex) => (
                  <div key={partIndex}>{part.text}</div>
                ))}
        </div>
      ))}
    </div>
  );
}
