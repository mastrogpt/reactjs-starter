import { ChatMessage } from "../types";

// @ts-expect-error tuple argument type
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const getMessagesByService = (service: string): ChatMessage[] => {
  const messagges: { mastrogpt: ChatMessage[]; openai: ChatMessage[] } = {
    mastrogpt: [
      {
        role: "bot",
        text: "Welcome, this is MastroGPT demo chat showing what it can display. Please select: 'code', 'chess', 'html', 'message'. ",
      },
    ],
    openai: [
      {
        role: "bot",
        text: "Welcome to the OpenAI demo chat, you can chat with OpenAI.",
      },
    ],
  };
  const defaultMessage: ChatMessage[] = [
    {
      role: "bot",
      text: "Welcome to MastroGPT! Select a service from top menu to start chatting with me.",
    },
  ];
  return messagges[service as keyof typeof messagges] || defaultMessage;
};
