import Connection from "./Connection.js";

class ActionHandler {
    static pendingEvents = [];

    static waitForEvent(event) {
        return new Promise(resolve => {
            const listener = () => {
                window.removeEventListener(event, listener);
                resolve();
            }
            window.addEventListener(event, listener);
        });
    }

    static waitUntilEventResult(event) {
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

    static resultEvent(event, result) {
        const index = this.pendingEvents.findIndex(e => e.event === event);
        if(index > -1) {
            this.pendingEvents[index].result = JSON.parse(result);
        }
    }

    static async searchDevice() {
        window.location = "action.event:command:searchDevice";

        const result = await this.waitUntilEventResult("command:searchDevice");

        return new Connection(result.ipAddress);
    }

    static async selectFile() {
        window.location = "action.event:command:selectFile";

        const result = await this.waitUntilEventResult("command:selectFile");

        return result.name;
    }

    static async sendFile() {
        window.location = "action.event:command:sendFile";

        await this.waitUntilEventResult("command:sendFile");

        return true;
    }
}

export default ActionHandler;