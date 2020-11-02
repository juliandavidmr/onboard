interface Observer<E> {
    eventName: E;
    callback: Function;
    ref?: string | number;
}

export class Events<E = string> {

    private observers: Observer<E>[] = [];

    constructor() {}

    /**
     * 
     * @param eventName 
     * @param callback 
     */
    emit<D = any>(eventName: E, data?: D): boolean {
        const toEmit = this.observers.filter(o => o.eventName === eventName);
        if (toEmit.length) {
            let success = true;
            toEmit.map(observer => {
                try {
                    observer.callback.call(null, data);
                } catch (error) {
                    success = false;
                }
            });

            return success
        }
        return false;
    }

    on(eventName: E, callback: Function, ref?: string) {
        this.observers.push({ eventName, callback, ref });
    }

    remove(eventName: E) {
        this.observers = this.observers.filter(o => o.eventName === eventName);
        return this.observers.length;
    }

    removeByRef(ref: string) {
        this.observers = this.observers.filter(o => o.ref === ref);
        return this.observers.length;
    }
}