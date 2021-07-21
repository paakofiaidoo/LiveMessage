import React, { FunctionComponent } from "react";
import { KernelProvider } from "./kernel";

export const AppProvider: FunctionComponent = ({ children }) => {
  return <KernelProvider>{children}</KernelProvider>;
};
