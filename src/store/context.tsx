import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createWebSocketClient } from "../utils/apollo";
import { AuthProvider } from "./auth";
import { MessageProvider } from "./message";
import { UserProvider } from "./user";

interface SendWebSocket {
  (message: "connect" | "disconnect", data?: any): void;
}

interface AppContextValue {
  websocketClient: SubscriptionClient | undefined;
  sendWebSocket(
    message: "connect" | "disconnect",
    data?: any
  ): void;
}

const initialValue: AppContextValue = {
  websocketClient: undefined,
  sendWebSocket: () => {},
};

export const context = createContext(initialValue);
export const useAppContext = () => useContext(context);
export const AppProvider: FunctionComponent = ({ children }) => {
  const [wsState, setWsState] = useState("idle");
  const [value, setValue] = useState(initialValue);

  const sendWebSocket: SendWebSocket = (message) => setWsState(message);

  // Connecting to websocket
  useEffect(() => {
    switch (wsState) {
      case "disconnect":
        console.log("[ws] Disconnecting...");
        if (value.websocketClient) value.websocketClient.close();
        setValue((value) => ({ ...value, websocketClient: undefined }));
        setWsState("idle");
        break;

      case "connect":
        console.log("[ws] Connecting...");
        setValue((value) => ({
          ...value,
          websocketClient: createWebSocketClient(),
        }));
        setWsState("idle");
        break;

      default:
        break;
    }
  }, [wsState]);

  return (
    <context.Provider value={{ ...value, sendWebSocket }}>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>{children}</MessageProvider>
        </UserProvider>
      </AuthProvider>
    </context.Provider>
  );
};
