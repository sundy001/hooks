import EventEmitter from "events";

const emitter = new EventEmitter();

export const emit = (eventName: string, ...args: any[]) => {
  emitter.emit(eventName, ...args);
};

export const addListener = (eventName: string, listener: Listener) => {
  emitter.addListener(eventName, listener);
};

export const removeListener = (eventName: string, listener: Listener) => {
  emitter.removeListener(eventName, listener);
};

type Listener = (...args: any[]) => void;
