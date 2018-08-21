// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import { RayonEvent } from 'common/model/RayonEvent';

type EventListner = (event) => void;

abstract class RayonDC {
  protected _eventListeners: Map<RayonEvent, Set<EventListener>>;

  constructor() {
    this._eventListeners = new Map();
  }

  public addEventListener(eventType: number, listner: EventListner): void {
    if (this._eventListeners[eventType] === undefined) this._eventListeners[eventType] = new Set();
    this._eventListeners[eventType].add(listner);
  }

  public removeEventListener(eventType: number, listner: EventListner): void {
    if (this._eventListeners[eventType] === undefined) return;
    this._eventListeners[eventType].delete(listner);
  }

  public getUserAccount() {
    return ServerAgent.getUserAccount();
  }
}

export default RayonDC;
