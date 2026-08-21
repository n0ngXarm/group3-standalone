const finiteNonNegative = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : fallback;
};

export function createPausableClock({ duration, now = () => performance.now(), onExpire = () => {} } = {}) {
  let remaining = finiteNonNegative(duration);
  let rate = 1;
  let running = false;
  let disposed = false;
  let expired = remaining === 0;
  let anchor = now();

  const expireOnce = () => {
    if (expired || remaining > 0) return;
    expired = true;
    running = false;
    onExpire();
  };

  const settle = () => {
    if (!running || disposed) return remaining;
    const current = now();
    const elapsed = Math.max(0, current - anchor);
    anchor = current;
    remaining = Math.max(0, remaining - (elapsed * rate));
    expireOnce();
    return remaining;
  };

  const start = () => {
    if (disposed || running || remaining <= 0) return remaining;
    anchor = now();
    running = true;
    return remaining;
  };

  const pause = () => {
    settle();
    running = false;
    return remaining;
  };

  return {
    start,
    resume: start,
    pause,
    getRemaining: settle,
    isRunning: () => running,
    setRate(nextRate) {
      settle();
      rate = finiteNonNegative(nextRate, 1);
      return rate;
    },
    addTime(amount, maximum = Number.POSITIVE_INFINITY) {
      settle();
      const cap = finiteNonNegative(maximum, Number.POSITIVE_INFINITY);
      remaining = Math.min(cap, remaining + finiteNonNegative(amount));
      if (remaining > 0) expired = false;
      return remaining;
    },
    reset(nextDuration = duration) {
      remaining = finiteNonNegative(nextDuration);
      running = false;
      expired = remaining === 0;
      anchor = now();
      return remaining;
    },
    dispose() {
      if (disposed) return;
      pause();
      disposed = true;
    },
  };
}

export function createPausableScheduler({
  now = () => performance.now(),
  setTimer = (callback, delay) => globalThis.setTimeout(callback, delay),
  clearTimer = (id) => globalThis.clearTimeout(id),
} = {}) {
  let nextId = 1;
  let paused = false;
  let disposed = false;
  const tasks = new Map();

  const arm = (task) => {
    if (paused || disposed || !tasks.has(task.id)) return;
    task.due = now() + task.remaining;
    task.timerId = setTimer(() => {
      if (!tasks.has(task.id) || paused || disposed) return;
      tasks.delete(task.id);
      task.timerId = null;
      task.callback();
    }, task.remaining);
  };

  const clearTaskTimer = (task) => {
    if (task.timerId === null) return;
    clearTimer(task.timerId);
    task.timerId = null;
  };

  const invalidate = () => {
    tasks.forEach(clearTaskTimer);
    tasks.clear();
  };

  return {
    schedule(callback, delay = 0) {
      if (disposed || typeof callback !== "function") return null;
      const task = {
        id: nextId,
        callback,
        due: now(),
        remaining: finiteNonNegative(delay),
        timerId: null,
      };
      nextId += 1;
      tasks.set(task.id, task);
      arm(task);
      return task.id;
    },
    cancel(id) {
      const task = tasks.get(id);
      if (!task) return false;
      clearTaskTimer(task);
      tasks.delete(id);
      return true;
    },
    pause() {
      if (paused || disposed) return;
      const current = now();
      paused = true;
      tasks.forEach((task) => {
        task.remaining = Math.max(0, task.due - current);
        clearTaskTimer(task);
      });
    },
    resume() {
      if (!paused || disposed) return;
      paused = false;
      tasks.forEach(arm);
    },
    invalidate,
    dispose() {
      if (disposed) return;
      invalidate();
      disposed = true;
    },
    pendingCount: () => tasks.size,
  };
}
