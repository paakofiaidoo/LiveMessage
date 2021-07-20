export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  status: "online" | "offline";
  blockBy: string[];
}

export interface Message {
  id: string;
  sentBy: User;
  sentTo: User;
  content: string;
  sentAt: string;
}

export interface Chat {
  with: string;
  messages: Message[];
  message: string;
}
