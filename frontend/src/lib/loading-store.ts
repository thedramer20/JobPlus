type Listener = () => void;

let pendingRequests = 0;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function beginGlobalLoading() {
  pendingRequests += 1;
  notify();
}

export function endGlobalLoading() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  notify();
}

export function getGlobalLoadingCount() {
  return pendingRequests;
}

export function subscribeGlobalLoading(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
