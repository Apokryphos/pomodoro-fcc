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
    const event = this.events.find(e => e.name === eventName);

    if (!event) {
      throw new Error(`Event ${eventName} is not registered.`);
    }

    event.callbacks.forEach(s => s());
  }

  registerEvent(eventName: string) {
    const event: Event = {
      name: eventName,
      callbacks: [],
    };

    this.events.push(event);
  }

  subscribe(eventName: string, callback: EventCallback) {
    const event = this.events.find(e => e.name === eventName);

    if (!event) {
      throw new Error(`Event ${eventName} is not registered.`);
    }

    event.callbacks.push(callback);
  }
}

module.exports = EventHub;
