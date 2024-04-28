import { EventEmitter } from 'events';

export class Event extends EventEmitter {
    private static instance: Event | null = null;

    constructor() {
        super();
    }

    public static getInstance(): Event{
        if(!Event.instance){
            Event.instance = new Event();
        }
        return Event.instance;
    }

    public invoke(event_name:string,data: any): void {
        this.emit(event_name, data);
    }
}
