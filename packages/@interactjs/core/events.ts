import type { Scope } from '@interactjs/core/scope'
import type { Element } from '@interactjs/core/types'
import * as arr from '@interactjs/utils/arr'
import * as domUtils from '@interactjs/utils/domUtils'
import is from '@interactjs/utils/is'
import pExtend from '@interactjs/utils/pointerExtend'
import * as pointerUtils from '@interactjs/utils/pointerUtils'

import type { NativeEventTarget } from './NativeTypes'

declare module '@interactjs/core/scope' {
  interface Scope {
    events: ReturnType<typeof install>
  }
}

interface EventOptions {
  capture: boolean
  passive: boolean
}

type PartialEventTarget = Partial<NativeEventTarget>

type ListenerEntry = { func: (event: Event | FakeEvent) => any, options: EventOptions }

function install (scope: Scope) {
  const targets: Array<{
    eventTarget: PartialEventTarget
    events: { [type: string]: ListenerEntry[] }
  }> = []

  const delegatedEvents: {
    [type: string]: Array<{
      selector: string
      context: Node
      listeners: ListenerEntry[]
    }>
  } = {}
  const documents: Document[] = []

  const eventsMethods = {
    add,
    remove,

    addDelegate,
    removeDelegate,

    delegateListener,
    delegateUseCapture,
    delegatedEvents,
    documents,

    targets,

    supportsOptions: false,
    supportsPassive: false,
  }

  // check if browser supports passive events and options arg
  scope.document?.createElement('div').addEventListener('test', null, {
    get capture () {
      return (eventsMethods.supportsOptions = true)
    },
    get passive () {
      return (eventsMethods.supportsPassive = true)
    },
  })

  scope.events = eventsMethods

  function add (
    eventTarget: PartialEventTarget,
    type: string,
    listener: ListenerEntry['func'],
    optionalArg?: boolean | EventOptions,
  ) {
    if (!eventTarget.addEventListener) return

    const options = getOptions(optionalArg)
    let target = arr.find(targets, (t) => t.eventTarget === eventTarget)

    if (!target) {
      target = {
        eventTarget,
        events: {},
      }

      targets.push(target)
    }

    if (!target.events[type]) {
      target.events[type] = []
    }

    if (!arr.find(target.events[type], (l) => l.func === listener && optionsMatch(l.options, options))) {
      eventTarget.addEventListener(
        type,
        listener as any,
        eventsMethods.supportsOptions ? options : options.capture,
      )
      target.events[type].push({ func: listener, options })
    }
  }

  function remove (
    eventTarget: PartialEventTarget,
    type: string,
    listener?: 'all' | ListenerEntry['func'],
    optionalArg?: boolean | EventOptions,
  ) {
    if (!eventTarget.addEventListener || !eventTarget.removeEventListener) return

    const targetIndex = arr.findIndex(targets, (t) => t.eventTarget === eventTarget)
    const target = targets[targetIndex]

    if (!target || !target.events) {
      return
    }

    if (type === 'all') {
      for (type in target.events) {
        if (target.events.hasOwnProperty(type)) {
          remove(eventTarget, type, 'all')
        }
      }
      return
    }

    let typeIsEmpty = false
    const typeListeners = target.events[type]

    if (typeListeners) {
      if (listener === 'all') {
        for (let i = typeListeners.length - 1; i >= 0; i--) {
          const entry = typeListeners[i]
          remove(eventTarget, type, entry.func, entry.options)
        }
        return
      } else {
        const options = getOptions(optionalArg)

        for (let i = 0; i < typeListeners.length; i++) {
          const entry = typeListeners[i]
          if (entry.func === listener && optionsMatch(entry.options, options)) {
            eventTarget.removeEventListener(
              type,
              listener as any,
              eventsMethods.supportsOptions ? options : options.capture,
            )
            typeListeners.splice(i, 1)

            if (typeListeners.length === 0) {
              delete target.events[type]
              typeIsEmpty = true
            }

            break
          }
        }
      }
    }

    if (typeIsEmpty && !Object.keys(target.events).length) {
      targets.splice(targetIndex, 1)
    }
  }

  function addDelegate (
    selector: string,
    context: Node,
    type: string,
    listener: ListenerEntry['func'],
    optionalArg?: any,
  ) {
    const options = getOptions(optionalArg)
    if (!delegatedEvents[type]) {
      delegatedEvents[type] = []

      // add delegate listener functions
      for (const doc of documents) {
        add(doc, type, delegateListener)
        add(doc, type, delegateUseCapture, true)
      }
    }

    const delegates = delegatedEvents[type]
    let delegate = arr.find(delegates, (d) => d.selector === selector && d.context === context)

    if (!delegate) {
      delegate = { selector, context, listeners: [] }
      delegates.push(delegate)
    }

    delegate.listeners.push({ func: listener, options })
  }

  function removeDelegate (
    selector: string,
    context: Document | Element,
    type: string,
    listener?: ListenerEntry['func'],
    optionalArg?: any,
  ) {
    const options = getOptions(optionalArg)
    const delegates = delegatedEvents[type]
    let matchFound = false
    let index: number

    if (!delegates) return

    // count from last index of delegated to 0
    for (index = delegates.length - 1; index >= 0; index--) {
      const cur = delegates[index]
      // look for matching selector and context Node
      if (cur.selector === selector && cur.context === context) {
        const { listeners } = cur

        // each item of the listeners array is an array: [function, capture, passive]
        for (let i = listeners.length - 1; i >= 0; i--) {
          const entry = listeners[i]

          // check if the listener functions and capture and passive flags match
          if (entry.func === listener && optionsMatch(entry.options, options)) {
            // remove the listener from the array of listeners
            listeners.splice(i, 1)

            // if all listeners for this target have been removed
            // remove the target from the delegates array
            if (!listeners.length) {
              delegates.splice(index, 1)

              // remove delegate function from context
              remove(context, type, delegateListener)
              remove(context, type, delegateUseCapture, true)
            }

            // only remove one listener
            matchFound = true
            break
          }
        }

        if (matchFound) {
          break
        }
      }
    }
  }

  // bound to the interactable context when a DOM event
  // listener is added to a selector interactable
  function delegateListener (event: Event | FakeEvent, optionalArg?: any) {
    const options = getOptions(optionalArg)
    const fakeEvent = new FakeEvent(event as Event)
    const delegates = delegatedEvents[event.type]
    const [eventTarget] = pointerUtils.getEventTargets(event as Event)
    let element: Node = eventTarget

    // climb up document tree looking for selector matches
    while (is.element(element)) {
      for (let i = 0; i < delegates.length; i++) {
        const cur = delegates[i]
        const { selector, context } = cur

        if (
          domUtils.matchesSelector(element, selector) &&
          domUtils.nodeContains(context, eventTarget) &&
          domUtils.nodeContains(context, element)
        ) {
          const { listeners } = cur

          fakeEvent.currentTarget = element

          for (const entry of listeners) {
            if (optionsMatch(entry.options, options)) {
              entry.func(fakeEvent)
            }
          }
        }
      }

      element = domUtils.parentNode(element)
    }
  }

  function delegateUseCapture (this: Element, event: Event | FakeEvent) {
    return delegateListener.call(this, event, true)
  }

  // for type inferrence
  return eventsMethods
}

class FakeEvent implements Partial<Event> {
  currentTarget: Node
  originalEvent: Event
  type: string

  constructor (originalEvent: Event) {
    this.originalEvent = originalEvent
    // duplicate the event so that currentTarget can be changed
    pExtend(this, originalEvent)
  }

  preventOriginalDefault () {
    this.originalEvent.preventDefault()
  }

  stopPropagation () {
    this.originalEvent.stopPropagation()
  }

  stopImmediatePropagation () {
    this.originalEvent.stopImmediatePropagation()
  }
}

function getOptions (param: { [index: string]: any } | boolean): { capture: boolean, passive: boolean } {
  if (!is.object(param)) {
    return { capture: !!param, passive: false }
  }

  return {
    capture: !!param.capture,
    passive: !!param.passive,
  }
}

function optionsMatch (a: Partial<EventOptions> | boolean, b: Partial<EventOptions>) {
  if (a === b) return true

  if (typeof a === 'boolean') return !!b.capture === a && !!b.passive === false

  return !!a.capture === !!b.capture && !!a.passive === !!b.passive
}

export default {
  id: 'events',
  install,
}
