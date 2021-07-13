import { assign, EventData, State } from "xstate";

export interface Send<T> {
  (event: any, payload?: EventData | undefined): any | State<T>;
}

export const createSend = <T>(initialContext: T): Send<T> => {
  return (event, payload) => ({ context: initialContext });
};

export const createPersist = (storeName: string) => {
  return <T>(ctx: T) => {
    if (!localStorage) return;
    localStorage.setItem(storeName, JSON.stringify(ctx));
  };
};

export const createLoadContext = <T>(storeName: string) => {
  return assign<T>((ctx) => {
    try {
      if (!localStorage) throw new Error("No localStorage");

      const saved = localStorage.getItem(storeName) || "{}";
      const parsed = JSON.parse(saved);

      return parsed;
    } catch (e) {
      return ctx;
    }
  });
};
