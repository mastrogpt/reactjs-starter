"use client";
import { ChatMessage, ChatResponse } from "../types";
import React from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getMessagesByService } from "../utils";
import clsx from "clsx";

let BASEURL = "";
if (typeof window !== "undefined") {
  BASEURL = window.location.protocol + "//" + window.location.host + "/";
}

export default function MastroGPT({ service }: Readonly<{ service: string }>) {
  const defaultMessage = getMessagesByService(service);
  const [messagges, setMessagges] =
    React.useState<ChatMessage[]>(defaultMessage);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [requests, setRequests] = React.useState<string>("0");

  const [chatResponse, setChatResponse] = React.useState<ChatResponse>({
    code: "",
    language: "",
    message: "",
    output: "",
    state: "",
    title: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = messageRef.current?.value;
    messageRef.current!.value = "";

    if (message) {
      setMessagges((prevMessages) => [
        ...prevMessages,
        { role: "user", text: message },
      ]);

      setIsLoading(true);

      fetch(`${BASEURL}api/my/${service}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: message, state: requests }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessagges((prevMessages) => [
            ...prevMessages,
            { role: "bot", text: data.output },
          ]);
          setChatResponse(data);
          setRequests(data.state || "0");
          if (data?.chess) {
            setIsLoading(true);
            fetch(BASEURL + "api/my/mastrogpt/display", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ chess: data.chess }),
            })
              .then((response) => response.text())
              .then((data) => {
                setChatResponse({ html: data });
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => {
            const chatElement = document.getElementById("chat");
            if (chatElement) {
              const firstChild = chatElement.children[0] as HTMLElement;
              if (firstChild) {
                firstChild.scrollTop = firstChild.scrollHeight;
              }
            }
          }, 50);
        });
    }
  };

  const messageRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <section id="chat" className="flex flex-col overflow-auto h-[90vh]">
        <div className="mt-auto overflow-y-auto">
          {messagges.map((message, index) => (
            <div
              key={index}
              className={`p-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`p-4 rounded-md inline-block ${
                  message.role === "user"
                    ? "bg-purple-500 text-white"
                    : "bg-zinc-900 text-white"
                }`}
              >
                <Markdown>{message.text}</Markdown>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <form
            className="p-4 bg-zinc-900 rounded-md flex items-center gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className={clsx(
                "bg-zinc-900 text-white w-full focus:outline-none",
                service === "" && "cursor-not-allowed"
              )}
              placeholder="Type a message"
              ref={messageRef}
              disabled={service === ""}
            />
            <button type="submit" className="text-purple-500">
              {isLoading ? (
                "Wait..."
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </section>
      <section id="code-output">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-white mb-6">
            Watch here for rich output
          </h1>
          <div>
            {chatResponse.title && chatResponse.message && (
              <div className="bg-zinc-900 text-white p-4 rounded-md mb-6">
                <h1 className="text-2xl font-bold">{chatResponse.title}</h1>
                <p>{chatResponse.message}</p>
              </div>
            )}
            {chatResponse.code && (
              <pre className="bg-zinc-900 text-white p-4 rounded-md">
                <SyntaxHighlighter language="javascript" style={dark}>
                  {chatResponse.code}
                </SyntaxHighlighter>
              </pre>
            )}
            {chatResponse.html && (
              <div
                className="bg-white p-4 rounded-md"
                dangerouslySetInnerHTML={{ __html: chatResponse.html }}
              ></div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
