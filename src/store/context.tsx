import React, { FunctionComponent } from "react";
import { AuthProvider } from "./auth-store";
import { MessageProvider } from "./message-store";
import { UserProvider } from "./user-store";

export const AppProvider: FunctionComponent = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MessageProvider>{children}</MessageProvider>
      </UserProvider>
    </AuthProvider>
  );
};
