// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

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
    return ReverseInquiryServerAgent.getUserAccount();
  }
}

export default RayonDC;
