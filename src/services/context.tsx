import React, { FunctionComponent } from "react";
import { AuthProvider } from "./auth";
import { ChatProvider } from "./chat";
import { CoreProvider } from "./kernel";
import { NetworkProvider } from "./network";
import { UserProvider } from "./user";

export const AppProvider: FunctionComponent = ({ children }) => {
  return (
    <CoreProvider>
      <NetworkProvider>
        <AuthProvider>
          <UserProvider>
            <ChatProvider>{children}</ChatProvider>
          </UserProvider>
        </AuthProvider>
      </NetworkProvider>
    </CoreProvider>
  );
};
