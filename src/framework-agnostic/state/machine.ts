/**
 * @fileoverview XState-compatible state machine with signal-based state management
 *
 * This file implements a state machine that integrates with our reactive signal system,
 * providing a declarative and robust way to manage complex component states.
 *
 * Key Design Decisions:
 * - API inspired by XState for familiarity and power.
 * - State is stored in a Signal, making it automatically reactive.
 * - Eliminates impossible states and clearly defines state transitions.
 * - JSDoc documentation to explain state machine patterns and usage.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { Signal, useSignal } from '../core/reactive'

/**
 * Defines the structure for a state node in the machine.
 *
 * @template TContext The type of context data for the machine.
 */
export interface StateNodeConfig<TContext> {
  on?: {
    [event: string]:
      | string
      | {
          target: string
          actions?: ((context: TContext, event: any) => Partial<TContext>)[]
        }
  }
  entry?: ((context: TContext) => Partial<TContext>)[]
  exit?: ((context: TContext) => Partial<TContext>)[]
}

/**
 * Defines the overall configuration for a state machine.
 *
 * @template TContext The type of context data for the machine.
 */
export interface StateMachineConfig<TContext> {
  id: string
  initial: string
  context?: TContext
  states: {
    [state: string]: StateNodeConfig<TContext>
  }
}

/**
 * Represents the state of the machine at any given time.
 *
 * @template TContext The type of context data for the machine.
 */
export interface MachineState<TContext> {
  value: string
  context: TContext
}

/**
 * The created state machine instance.
 *
 * @template TContext The type of context data for the machine.
 */
export interface StateMachine<TContext> {
  /** A reactive signal holding the current state of the machine. */
  state: Signal<MachineState<TContext>>
  /** Sends an event to the machine to trigger a transition. */
  send: (event: string | { type: string; [key: string]: any }) => void
  /** Checks if the current state matches a given state value. */
  matches: (stateValue: string) => boolean
}

/**
 * Creates a new state machine.
 *
 * This function takes a configuration object and returns a state machine instance
 * that uses signals for reactive state management.
 *
 * @template TContext The type of context data for the machine.
 * @param config The state machine configuration.
 * @returns A new state machine instance.
 *
 * @example
 * ```typescript
 * const feedbackMachine = createStateMachine({
 *   id: 'feedback',
 *   initial: 'idle',
 *   context: { feedback: '', error: null },
 *   states: {
 *     idle: {
 *       on: {
 *         SUBMIT: 'submitting'
 *       }
 *     },
 *     submitting: {
 *       on: {
 *         SUCCESS: 'success',
 *         FAILURE: 'failure'
 *       }
 *     },
 *     success: {},
 *     failure: {}
 *   }
 * });
 *
 * // Reading state
 * console.log(feedbackMachine.state.value.value); // 'idle'
 *
 * // Transitioning state
 * feedbackMachine.send('SUBMIT');
 * console.log(feedbackMachine.state.value.value); // 'submitting'
 * ```
 */
export function createStateMachine<TContext extends object>(
  config: StateMachineConfig<TContext>
): StateMachine<TContext> {
  const initialState: MachineState<TContext> = {
    value: config.initial,
    context: config.context || ({} as TContext),
  }

  const state = useSignal(initialState)

  const send = (event: string | { type: string; [key: string]: any }) => {
    const eventType = typeof event === 'string' ? event : event.type
    const currentStateNode = config.states[state.value.value]

    if (currentStateNode?.on?.[eventType]) {
      const transition = currentStateNode.on[eventType]
      const targetState =
        typeof transition === 'string' ? transition : transition.target

      let nextContext = { ...state.value.context }

      // Run exit actions on current state
      currentStateNode.exit?.forEach(action => {
        nextContext = { ...nextContext, ...action(nextContext) }
      })

      // Run transition actions
      if (typeof transition !== 'string' && transition.actions) {
        transition.actions.forEach(action => {
          nextContext = { ...nextContext, ...action(nextContext, event) }
        })
      }

      const nextStateNode = config.states[targetState]
      // Run entry actions on new state
      nextStateNode?.entry?.forEach(action => {
        nextContext = { ...nextContext, ...action(nextContext) }
      })

      state.value = {
        value: targetState,
        context: nextContext,
      }
    }
  }

  const matches = (stateValue: string): boolean => {
    return state.value.value === stateValue
  }

  return {
    state,
    send,
    matches,
  }
}
