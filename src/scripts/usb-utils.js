import {hex} from "./util";
import usbIds from "./usb_ids";

const log = (...args) => {
    console.log(...args)
}

export const getUsbInfo = async (vid, pid) => {
    let info = {vid, pid}
    if (vid instanceof SerialPort) {
        const i = vid.getInfo()
        vid = info.vid = hex(i.usbVendorId)
        pid = info.pid = hex(i.usbProductId)
    }
    log(`searching for ${vid}:${pid}`)
    const lines = usbIds.split('\n');
    for (var i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === '# List of known device classes, subclasses and protocols') {
            break
        }
        if (line.startsWith('#') || !line) continue //comment

        if (info.vendor) {
            const pidMatch = line.match(/^\t[0-9a-f]{4}  /)
            if (pidMatch) {
                if (pid === line.substring(1, 5)) {
                    info.product = line.substring(7);
                    return info
                }
            }
        }

        const vidMatch = line.match(/^[0-9a-f]{4}  /)
        if(vidMatch) {
            if (line.substring(0, 4) === vid) {
                info.vendor = line.substring(6);
            }
            else if (info.vendor) {
                return info // pid not found
            }
        }
    }
    log(`unable to find ${vid}:${pid}`)
    return info
}