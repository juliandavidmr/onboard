interface Observer<E> {
    eventName: E;
    callback: Function;
    ref?: string | number;
}

export class Events<E = string> {
    private observers: Map<E, Observer<E>[]> = new Map();

    /**
     *
     * @param eventName
     * @param callback
     */
    emit<D = any>(eventName: E, data?: D, cb?: Function): boolean {
      const toEmit = this.observers.get(eventName);

      if (toEmit && toEmit.length) {
        let success = true;
        for (const observer of toEmit) {
          try {
            const r = observer.callback.call(null, data);
            if (typeof cb === 'function') {
              cb(null, r);
            }
          } catch (error) {
            success = false;
          }
        }

        return success;
      }
      return false;
    }

    on(eventName: E, callback: Function, ref?: string) {
      if (this.observers.has(eventName)) {
        this.observers.get(eventName)!.push({ eventName, callback, ref });
      } else {
        this.observers.set(eventName, [{ eventName, callback, ref }]);
      }
    }

    remove(eventName: E) {
      return this.observers.delete(eventName);
    }

    removeByRef(ref: string) {
      // todo
    }
}
