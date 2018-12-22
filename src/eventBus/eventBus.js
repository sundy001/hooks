import EventEmitter from "events";

const emitter = new EventEmitter();

export const emit = (eventName, ...args) => {
  emitter.emit(eventName, ...args);
};

export const addListener = (eventName, listener) => {
  emitter.addListener(eventName, listener);
};

export const removeListener = (eventName, listener) => {
  emitter.removeListener(eventName, listener);
};
