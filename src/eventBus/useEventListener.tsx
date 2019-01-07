import { useRef, useEffect } from "react";
import { addListener, removeListener } from "./eventBus";

// TODO: add better type for handler
export const useElementListener = (
  eventName: string,
  id: number,
  handler: (...args: any[]) => void
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener = ({ id: eventElementId, ...event }) => {
      if (eventElementId !== id) {
        return;
      }

      handlerRef.current(event);
    };

    addListener(eventName, listener);

    return () => {
      removeListener(eventName, listener);
    };
  }, []);
};
