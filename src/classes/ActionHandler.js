import Connection from "./Connection.js";

class ActionHandler {
    os = "windows";
    pendingEvents = [];
    constructor() {
        const ua = navigator.userAgent.toLocaleLowerCase();
        const isAndroid = ua.includes("android");
        const isIos = ua.includes("mac");
        if(isAndroid) {
            this.os = "android";
        }
        if(isIos) {
            this.os = "ios";
        }
    }

    waitForEvent(event) {
        return new Promise(resolve => {
            const listener = () => {
                window.removeEventListener(event, listener);
                resolve();
            }
            window.addEventListener(event, listener);
        });
    }

    waitUntilEventResult(event) {
        return new Promise(async (resolve, reject) => {
            this.pendingEvents.push({
                event: event,
                result: null
            });
            const index = this.pendingEvents.findIndex(e => e.event === event);
            if(index > -1) {
                let result = null;
                while(true) {
                    if(this.pendingEvents[index].result !== null) {
                        result = this.pendingEvents[index].result;
                        this.pendingEvents.splice(index);
                        break;
                    }
                    await new Promise(r => setTimeout(r, 25));
                }
                resolve(result);
            } else {
                reject("Pending event not found.");
            }
        });
    }

    resultEvent(event, result) {
        const index = this.pendingEvents.findIndex(e => e.event === event);
        if(index > -1) {
            this.pendingEvents[index].result = JSON.parse(result);
        }
    }

    async searchDevice() {
        window.location.href = "action.event:command:searchDevice";

        const result = await this.waitUntilEventResult("command:searchDevice");

        return new Connection(result.ipAddress);
    }

    async selectFile() {
        window.location.href = "action.event:command:selectFile";

        const result = await this.waitUntilEventResult("command:selectFile");

        return result.name;
    }

    async sendFile() {
        window.location.href = "action.event:command:sendFile";

        await this.waitUntilEventResult("command:sendFile");
    }
}

export default new ActionHandler();