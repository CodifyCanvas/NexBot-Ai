// app/lib/chat-refresh.ts
type Callback = () => void

let listeners: Callback[] = []

export function onChatsRefresh(callback: Callback) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter(cb => cb !== callback)
  }
}

export function refreshChats() {
  for (const callback of listeners) {
    callback()
  }
}
