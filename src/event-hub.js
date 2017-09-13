function isCallback(callback) {
  return (callback && typeof callback === 'function');
}

function EventHub() {
  this.events = [];
}

EventHub.prototype.broadcast = function(eventName) {
  const event = this.events.find(e => e.name === eventName);

  if (!event) {
    throw new Error(`Event ${eventName} is not registered.`);
  }

  event.subscribers.forEach(s => s());
};

EventHub.prototype.registerEvent = function(eventName) {
  const event = {
    name: eventName,
    subscribers: [],
  };

  this.events.push(event);
};

EventHub.prototype.subscribe = function(eventName, callback) {
  if (!isCallback(callback)) {
    throw new Error(`Specified callback for ${eventName} subscriber is invalid.`);
  }

  const event = this.events.find(e => e.name === eventName);

  if (!event) {
    throw new Error(`Event ${eventName} is not registered.`);
  }

  event.subscribers.push(callback);
};

module.exports = EventHub;
