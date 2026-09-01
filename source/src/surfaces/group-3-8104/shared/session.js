export function getLearnerSession() {
  try {
    return window.sessionStorage.getItem("huayun_learner_name");
  } catch (e) {
    return null;
  }
}

export function startLearnerSession(name) {
  try {
    window.sessionStorage.setItem("huayun_learner_name", name);
  } catch (e) {}
}

export function hasLearnerSession() {
  return !!getLearnerSession();
}

export function endLearnerSession() {
  try {
    window.sessionStorage.removeItem("huayun_learner_name");
    clearSessionInvalidation();
  } catch (e) {}
}

export function markSessionInvalidated(reason) {
  try {
    window.sessionStorage.setItem("huayun_session_invalidated", reason);
  } catch (e) {}
}

export function getSessionInvalidationReason() {
  try {
    return window.sessionStorage.getItem("huayun_session_invalidated");
  } catch (e) {
    return null;
  }
}

export function clearSessionInvalidation() {
  try {
    window.sessionStorage.removeItem("huayun_session_invalidated");
  } catch (e) {}
}
