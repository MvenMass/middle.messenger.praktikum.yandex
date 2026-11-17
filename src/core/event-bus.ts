type Listener<Args extends unknown[]> = (...args: Args) => void;

export class EventBus<Events extends Record<string, unknown[]>> {
  private listeners: { [Event in keyof Events]?: Listener<Events[Event]>[] } = {};

  on<Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>): void {
    const currentListeners = this.listeners[event] ?? [];

    this.listeners[event] = [...currentListeners, listener];
  }

  off<Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>): void {
    const currentListeners = this.listeners[event] ?? [];

    this.listeners[event] = currentListeners.filter((item) => item !== listener);
  }

  emit<Event extends keyof Events>(event: Event, ...args: Events[Event]): void {
    const currentListeners = this.listeners[event] ?? [];

    currentListeners.forEach((listener) => listener(...args));
  }
}
