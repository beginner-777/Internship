/**
 * ============================================================================
 * COSMIC WINE — Premium Animated Button
 * Production JavaScript: state machine + async lifecycle controller.
 *
 * Sections:
 *   1. Constants & Configuration
 *   2. DOM Cache
 *   3. State Manager
 *   4. Accessibility Helpers
 *   5. Render / DOM Sync
 *   6. Fake Async API
 *   7. Lifecycle Transitions
 *   8. Event Handlers
 *   9. Init
 * ============================================================================
 */

(function cosmicButtonModule() {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & CONFIGURATION
     No magic numbers below this point — everything interaction-timing or
     behavior related is named here so it can be tuned in one place.
     ========================================================================== */

  const STATES = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  });

  const CONFIG = Object.freeze({
    // Simulated network latency range (ms)
    REQUEST_DELAY_MIN: 1100,
    REQUEST_DELAY_MAX: 1900,
    // Probability (0–1) that the simulated request resolves successfully
    SUCCESS_RATE: 0.7,
    // How long the success state is displayed before auto-returning to idle
    SUCCESS_HOLD_DURATION: 2000,
    // Reduced-motion users get shorter holds so state changes don't feel
    // like they're stalling with no animation to justify the wait
    REDUCED_MOTION_HOLD_DURATION: 900,
  });

  const ARIA_LABELS = Object.freeze({
    [STATES.IDLE]: 'Submit action',
    [STATES.LOADING]: 'Submitting, please wait',
    [STATES.SUCCESS]: 'Submission successful',
    [STATES.ERROR]: 'Submission failed, press to retry',
  });

  const LABEL_TEXT = Object.freeze({
    [STATES.IDLE]: 'Submit',
    [STATES.LOADING]: 'Submit',
    [STATES.SUCCESS]: 'Success',
    [STATES.ERROR]: 'Try Again',
  });

  const STATUS_TEXT = Object.freeze({
    [STATES.IDLE]: 'Idle',
    [STATES.LOADING]: 'Loading',
    [STATES.SUCCESS]: 'Success',
    [STATES.ERROR]: 'Error',
  });

  const SR_ANNOUNCEMENTS = Object.freeze({
    [STATES.LOADING]: 'Submitting your request.',
    [STATES.SUCCESS]: 'Success. Your action was completed.',
    [STATES.ERROR]: 'Something went wrong. Please try again.',
    [STATES.IDLE]: 'Ready.',
  });


  /* ==========================================================================
     2. DOM CACHE
     Query once, reuse everywhere — avoids repeated lookups and reflows.
     ========================================================================== */

  const dom = {
    button: document.getElementById('cosmic-button'),
    label: document.getElementById('cosmic-button-label'),
    spinner: document.getElementById('cosmic-button-spinner'),
    successIcon: document.getElementById('cosmic-button-success'),
    errorIcon: document.getElementById('cosmic-button-error'),
    statusValue: document.getElementById('status-value'),
    announcer: document.getElementById('sr-announcer'),
    simulateSuccessBtn: document.getElementById('simulate-success'),
    simulateErrorBtn: document.getElementById('simulate-error'),
    resetBtn: document.getElementById('reset-button'),
  };

  /**
   * Bail out safely (rather than throwing) if the expected markup isn't
   * present — keeps this script defensive against partial page loads or
   * future markup changes.
   */
  const REQUIRED_ELEMENTS = ['button', 'label', 'spinner', 'successIcon', 'errorIcon', 'statusValue'];
  const hasRequiredMarkup = REQUIRED_ELEMENTS.every((key) => dom[key] instanceof HTMLElement);

  if (!hasRequiredMarkup) {
    console.warn('[CosmicButton] Required elements are missing from the DOM. Aborting init.');
    return;
  }


  /* ==========================================================================
     3. STATE MANAGER
     Single source of truth. Nothing outside this object mutates state
     directly — everything goes through transitionTo().
     ========================================================================== */

  const stateManager = {
    currentState: STATES.IDLE,
    previousState: null,
    isTransitioning: false,
    activeTimeouts: new Set(),
    requestToken: 0, // increments per request; stale async responses are ignored

    /**
     * Registers a timeout and tracks its ID so it can be cleared later.
     * Prevents duplicate/orphaned timers from stacking up.
     */
    setTrackedTimeout(callback, delay) {
      const id = window.setTimeout(() => {
        this.activeTimeouts.delete(id);
        callback();
      }, delay);
      this.activeTimeouts.add(id);
      return id;
    },

    /** Clears every pending timeout owned by this module. */
    clearAllTimeouts() {
      this.activeTimeouts.forEach((id) => window.clearTimeout(id));
      this.activeTimeouts.clear();
    },

    /** Invalidates any in-flight fake request so its result is ignored. */
    invalidatePendingRequests() {
      this.requestToken += 1;
      return this.requestToken;
    },
  };


  /* ==========================================================================
     4. ACCESSIBILITY HELPERS
     ========================================================================== */

  /** Returns true if the user has requested reduced motion at the OS level. */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Pushes a message into the assertive live region. Clearing the node
   * before setting new text (on a microtask delay) ensures repeated
   * identical messages are still announced by screen readers.
   */
  function announce(message) {
    if (!dom.announcer) return;
    dom.announcer.textContent = '';
    window.requestAnimationFrame(() => {
      dom.announcer.textContent = message;
    });
  }


  /* ==========================================================================
     5. RENDER / DOM SYNC
     Pure-ish functions that make the DOM match stateManager.currentState.
     Kept separate from transition logic so "what the UI looks like" and
     "when we change state" don't get tangled together.
     ========================================================================== */

  function syncAriaAttributes(state) {
    dom.button.setAttribute('aria-busy', String(state === STATES.LOADING));
    dom.button.setAttribute('aria-disabled', String(state === STATES.LOADING));
    dom.button.disabled = state === STATES.LOADING;
    dom.button.setAttribute('aria-label', ARIA_LABELS[state]);
  }

  function syncButtonContent(state) {
    dom.label.textContent = LABEL_TEXT[state];
  }

  function syncStatusPanel(state) {
    dom.statusValue.textContent = STATUS_TEXT[state];
    dom.statusValue.dataset.state = state;
  }

  function syncDataState(state) {
    dom.button.dataset.state = state;
  }

  /** Runs every visual/ARIA sync step for the given state in one place. */
  function render(state) {
    syncDataState(state);
    syncAriaAttributes(state);
    syncButtonContent(state);
    syncStatusPanel(state);
  }


  /* ==========================================================================
     6. FAKE ASYNC API
     Promise-based stand-in for a real network request. Configurable delay
     and success rate; supports a forced outcome for the testing panel.
     ========================================================================== */

  /**
   * Simulates an async request.
   * @param {Object} [options]
   * @param {'success'|'error'|null} [options.forceOutcome] - bypass the
   *   random success rate and resolve/reject deterministically. Used by the
   *   Testing Panel's Simulate Success / Simulate Error controls.
   * @returns {Promise<{ ok: boolean }>}
   */
  function requestFakeApi({ forceOutcome = null } = {}) {
    const delay = randomBetween(CONFIG.REQUEST_DELAY_MIN, CONFIG.REQUEST_DELAY_MAX);

    return new Promise((resolve, reject) => {
      stateManager.setTrackedTimeout(() => {
        const didSucceed =
          forceOutcome === 'success'
            ? true
            : forceOutcome === 'error'
              ? false
              : Math.random() < CONFIG.SUCCESS_RATE;

        if (didSucceed) {
          resolve({ ok: true });
        } else {
          reject(new Error('Simulated request failure'));
        }
      }, delay);
    });
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /* ==========================================================================
     7. LIFECYCLE TRANSITIONS
     Every state change funnels through transitionTo(), which updates the
     state manager, renders the DOM, and announces the change once — so
     JS and CSS never fall out of sync and screen readers never get
     duplicate or missing updates.
     ========================================================================== */

  /**
   * Moves the button to a new lifecycle state.
   * @param {string} nextState - one of STATES
   * @param {Object} [options]
   * @param {boolean} [options.silent] - skip the screen-reader announcement
   *   (used internally to avoid double-announcing during composite flows)
   */
  function transitionTo(nextState, { silent = false } = {}) {
    if (!Object.values(STATES).includes(nextState)) {
      console.warn(`[CosmicButton] Ignored invalid state transition: "${nextState}"`);
      return;
    }

    stateManager.previousState = stateManager.currentState;
    stateManager.currentState = nextState;

    render(nextState);

    if (!silent) {
      announce(SR_ANNOUNCEMENTS[nextState]);
    }
  }

  /**
   * Full click-to-result flow: loading -> fake API -> success/error ->
   * (on success) auto-return to idle. This is the single entry point for
   * both real user clicks and the Testing Panel's forced outcomes, so
   * behavior stays identical either way.
   */
  async function runSubmissionFlow({ forceOutcome = null } = {}) {
    // Spam-click / duplicate-request protection: refuse to start a new
    // flow if one is already in progress.
    if (stateManager.currentState === STATES.LOADING || stateManager.isTransitioning) {
      return;
    }

    stateManager.isTransitioning = true;
    const requestToken = stateManager.invalidatePendingRequests();

    transitionTo(STATES.LOADING);

    try {
      await requestFakeApi({ forceOutcome });

      // If a newer request superseded this one (e.g. Reset was pressed
      // mid-flight), silently abandon this stale result.
      if (requestToken !== stateManager.requestToken) return;

      await handleSuccessOutcome();
    } catch (error) {
      if (requestToken !== stateManager.requestToken) return;
      handleErrorOutcome(error);
    } finally {
      if (requestToken === stateManager.requestToken) {
        stateManager.isTransitioning = false;
      }
    }
  }

  /** Transitions into success, holds, then returns to idle automatically. */
  async function handleSuccessOutcome() {
    transitionTo(STATES.SUCCESS);

    const holdDuration = prefersReducedMotion()
      ? CONFIG.REDUCED_MOTION_HOLD_DURATION
      : CONFIG.SUCCESS_HOLD_DURATION;

    await waitTracked(holdDuration);

    // Guard again in case Reset fired during the hold.
    if (stateManager.currentState === STATES.SUCCESS) {
      transitionTo(STATES.IDLE, { silent: true });
      announce(SR_ANNOUNCEMENTS[STATES.IDLE]);
    }
  }

  /** Transitions into error and logs the underlying cause for diagnostics. */
  function handleErrorOutcome(error) {
    transitionTo(STATES.ERROR);
    console.warn('[CosmicButton] Request failed:', error.message);
    // Error state intentionally stays put (button remains enabled and
    // clickable — see style.css, which deliberately omits pointer-events:
    // none for this state) rather than auto-reverting, so the user
    // explicitly retries instead of the failure silently vanishing.
  }

  /** Promise wrapper around setTrackedTimeout so it can be awaited. */
  function waitTracked(delay) {
    return new Promise((resolve) => {
      stateManager.setTrackedTimeout(resolve, delay);
    });
  }

  /** Immediately restores the button to a clean idle state. */
  function resetToIdle() {
    stateManager.clearAllTimeouts();
    stateManager.invalidatePendingRequests();
    stateManager.isTransitioning = false;
    transitionTo(STATES.IDLE);
  }


  /* ==========================================================================
     8. EVENT HANDLERS
     ========================================================================== */

  function handleButtonClick() {
    runSubmissionFlow();
  }

  function handleSimulateSuccess() {
    runSubmissionFlow({ forceOutcome: 'success' });
  }

  function handleSimulateError() {
    runSubmissionFlow({ forceOutcome: 'error' });
  }

  function handleReset() {
    resetToIdle();
  }

  /**
   * Positions the ripple's origin at the pointer location so the glow
   * layer (styled in CSS via the --ripple-x/--ripple-y custom properties)
   * expands from where the user actually clicked rather than the center.
   */
  function handlePointerDown(event) {
    const rect = dom.button.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    dom.button.style.setProperty('--ripple-x', `${x}%`);
    dom.button.style.setProperty('--ripple-y', `${y}%`);
  }


  /* ==========================================================================
     9. INIT
     ========================================================================== */

  function bindEvents() {
    dom.button.addEventListener('click', handleButtonClick);
    dom.button.addEventListener('pointerdown', handlePointerDown);

    // Testing panel controls are optional in the markup — guard each one
    // individually so their absence doesn't break the core button.
    if (dom.simulateSuccessBtn) {
      dom.simulateSuccessBtn.addEventListener('click', handleSimulateSuccess);
    }
    if (dom.simulateErrorBtn) {
      dom.simulateErrorBtn.addEventListener('click', handleSimulateError);
    }
    if (dom.resetBtn) {
      dom.resetBtn.addEventListener('click', handleReset);
    }
  }

  function init() {
    render(stateManager.currentState);
    bindEvents();
  }

  init();
})();