//  @flow
type EventCallback = () => void;

type Event = {
  name: string,
  callbacks: Array<EventCallback>,
};

class EventHub {
  events: Array<Event>;

  constructor() {
    this.events = [];
  }

  broadcast(eventName: string) {
    // const event = this.events.find(e => e.name === eventName);
    const event = this._getEventByName(eventName);

    if (!event) {
      throw new Error(`Event ${eventName} is not registered.`);
    }

    event.callbacks.forEach(s => s());
  }

  _getEventByName(eventName: string) {
    for (let e = 0; e < this.events.length; ++e) {
      if (this.events[e].name === eventName) {
        return this.events[e];
      }
    }

    return undefined;
  }

  registerEvent(eventName: string) {
    const event: Event = {
      name: eventName,
      callbacks: [],
    };

    this.events.push(event);
  }

  subscribe(eventName: string, callback: EventCallback) {
    // const event = this.events.find(e => e.name === eventName);
    const event = this._getEventByName(eventName);

    if (!event) {
      throw new Error(`Event ${eventName} is not registered.`);
    }

    event.callbacks.push(callback);
  }
}

module.exports = EventHub;
