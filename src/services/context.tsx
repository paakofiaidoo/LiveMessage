import React, { FunctionComponent } from "react";
import { AuthProvider } from "./auth";
import { MessageProvider } from "./message";
import { NetworkProvider } from "./network";
import { UserProvider } from "./user";

export const AppProvider: FunctionComponent = ({ children }) => {
  return (
    <NetworkProvider>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>{children}</MessageProvider>
        </UserProvider>
      </AuthProvider>
    </NetworkProvider>
  );
};
