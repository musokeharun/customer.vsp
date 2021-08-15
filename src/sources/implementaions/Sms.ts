interface SmsHandler {
    contacts: string
    message: string
    sender: string

    send(): string
}

class CaltonHandler implements SmsHandler {
    contacts: string;
    message: string;
    sender: string;

    constructor(contacts: string, message: string, sender: string) {
        this.contacts = contacts;
        this.sender = sender;
        this.message = message;
    }


    send(): string {
        return "";
    }

}