import { useRef, useEffect } from "react";
import { addListener, removeListener } from "./eventBus";

export const useElementListener = (eventName, id, handler) => {
  const handlerRef = useRef();
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
