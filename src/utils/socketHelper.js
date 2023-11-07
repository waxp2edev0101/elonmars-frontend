import socket from "../utils/socket";

export const sendEvent = (eventName, data = {}) => {
    try {
      socket.emit(eventName, data);
    } catch (error) {
      console.log('Socket Helper Error : ' + error);
    }
};
  