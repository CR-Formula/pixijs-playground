import { useEffect, useState } from 'react';
import { getUsbInfo } from './usb-utils.js';
import { hex } from './util.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const vid_pid = (port) => {
  return hex(port.vid) + ':' + hex(port.pid);
}

export default function useSerialConnection() {
  const [state, setState] = useState({
    id: undefined,
    vendor: undefined,
    product: undefined,
    port: undefined,
    physicallyConnected: false,
    open: false,
    _reader: undefined,
    options: {
      baudRate: 115200,
      bufferSize: 255,
      dataBits: 8,
      flowControl: "none",
      parity: "none",
      stopBits: 1
    },
    signals: {},
    messages: [],
    prepend: '',
    append: '\n'
  });

  const selectPort = async () => {
    try {
      if (!navigator.serial) return false;
      const port = await navigator.serial.requestPort();
      const id = await getUsbInfo(state.port);
      console.log(id);
      setState(prevState => ({
        ...prevState,
        id: id,
        port: port
      }));
      console.log("Is it setting?");
      console.log(state.port, port);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const init = async (vid, pid) => {
    try {
      const ports = await navigator.serial.getPorts();

      const id = vid + ':' + pid;
      console.log('END');
      const port = ports.find((port) => vid_pid(port) === id);
      if (!port) {
        window.location.search = ``;
        return;
      }
      setState(prevState => ({
        ...prevState,
        id: {
          vid: id.vid,
          pid: id.pid
        },
        port: port
      }));
      const info = await getUsbInfo(port);
      console.log("info");
      console.log(info.pid);
      setState(prevState => ({
        ...prevState,
        id: info.vid + ':' + info.pid,
        vendor: info.vid,
        product: info.pid,
        physicallyConnected: true
      }));
      console.log(state.id);

      const onconnect = (e) => {
        console.log(state.id + 'device connected', e);
        setState(prevState => ({
          ...prevState,
          port: e.target,
          physicallyConnected: true
        }));
      };
      navigator.serial.addEventListener('connect', onconnect);

      const ondisconnect = (e) => {
        console.log(state.id + ' disconnect');
        setState(prevState => ({
          ...prevState,
          physicallyConnected: false,
          open: false
        }));
      };
      navigator.serial.addEventListener('disconnect', ondisconnect);
      // console.log(id);
      console.log(state.id, 'initialized');
    } catch (e) {
      console.error(e);
    }
  };

  const connect = async () => {
    console.log(state);
    if (!state.port) return;
    console.log(state.id + ': opening');
    try {
      await state.port.open(state.options);
      console.log(!(!state.port?.readable) + ': open tho1?');
      console.log((state.open) + ': open tho2?');
      setState(prevState => ({
        ...prevState,
        open: !(!state.port?.readable)
      }));
      console.log(state.id + ': opened');
      console.log(!(!state.port?.readable) + ': open tho3?');
      console.log((state.open) + ': open tho4?');
      monitor();
    } catch (e) {
      console.error(e);
      window.alert(e.message);
    }
  };

  const monitor = async () => {
    console.log(state);
    console.log('monitor()');
    while (!(!state.port?.readable)) {
      console.log("Entering While!");
      setState(prevState => ({
        ...prevState,
        open: true
      }));
      const reader = state.port.readable.getReader();
      setState(prevState => ({
        ...prevState,
        _reader: reader
      }));
      try {
        while (state.open) {
          const { value, done } = await reader.read();
          if (done) {
            setState(prevState => ({
              ...prevState,
              open: false
            }));
            break;
          }
          const decoded = decoder.decode(value);
          console.log(decoded);
          setState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, decoded]
          }));
        }
      } catch (error) {
        console.error('reading error', error);
      } finally {
        reader.releaseLock();
      }
    }
  };

  const write = async (data) => {
    if (state.port?.writable) {
      const writer = state.port.writable.getWriter();
      await writer.write(encoder.encode(data));
      writer.releaseLock();
    }
  };

  const close = async () => {
    if (state._reader) {
      await state._reader.cancel();
    }
    state.port.close();
  };

  return {
    state,
    selectPort,
    init,
    connect,
    monitor,
    write,
    close
  };
};
