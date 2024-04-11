export type Service = {
  name: string;
  url: string;
};

export type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export type ChatResponse = {
  code?: string;
  html?: string;
  language?: string;
  message?: string;
  output?: string;
  state?: string;
  title?: string;
};
