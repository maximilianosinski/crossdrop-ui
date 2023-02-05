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
        return new Promise(async resolve => {
            this.pendingEvents.push({
                event: event,
                result: null
            });
            const index = this.pendingEvents.findIndex(event => event.event === event);
            if(index > -1) {
                while(true) {
                    if(this.pendingEvents[index].result !== null) {
                        break;
                    }
                    await new Promise(r => setTimeout(r, 25));
                }
                resolve(this.pendingEvents[index].result);
            } throw "Pending event not found.";
        });
    }

    resultEvent(event, result) {
        const index = this.pendingEvents.findIndex(event => event.event === event);
        if(index > -1) {
            this.pendingEvents[index].result = JSON.parse(result);
        }
    }

    async searchDevice() {
        const string = JSON.stringify({
            event: "command:searchDevice"
        });

        if(this.os === "android") {
            android.JSInterface.processData(string);
        } else if(this.os === "windows") {
            CefSharp.PostMessage(string);
        }

        const result = this.waitUntilEventResult("command:searchDevice");
    }
}

export default new ActionHandler();