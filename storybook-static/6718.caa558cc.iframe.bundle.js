'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [6718],
    {
      './node_modules/jotai/esm/react.mjs': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          Kq: () => Provider,
          Xr: () => useSetAtom,
          fp: () => useAtom,
          md: () => useAtomValue,
        })
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          jotai_vanilla__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            './node_modules/jotai/esm/vanilla.mjs'
          ),
          jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_2__ =
            __webpack_require__(
              './node_modules/jotai/esm/vanilla/internals.mjs'
            )
        const StoreContext = (0,
        react__WEBPACK_IMPORTED_MODULE_0__.createContext)(void 0)
        function useStore(options) {
          const store = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(
            StoreContext
          )
          return (
            (null == options ? void 0 : options.store) ||
            store ||
            (0, jotai_vanilla__WEBPACK_IMPORTED_MODULE_1__.zp)()
          )
        }
        function Provider({ children, store }) {
          const storeRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(
            void 0
          )
          return (
            store ||
              storeRef.current ||
              (storeRef.current = (0,
              jotai_vanilla__WEBPACK_IMPORTED_MODULE_1__.y$)()),
            (0, react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
              StoreContext.Provider,
              { value: store || storeRef.current },
              children
            )
          )
        }
        const isPromiseLike = x =>
            'function' == typeof (null == x ? void 0 : x.then),
          attachPromiseStatus = promise => {
            promise.status ||
              ((promise.status = 'pending'),
              promise.then(
                v => {
                  ;((promise.status = 'fulfilled'), (promise.value = v))
                },
                e => {
                  ;((promise.status = 'rejected'), (promise.reason = e))
                }
              ))
          },
          use =
            react__WEBPACK_IMPORTED_MODULE_0__.use ||
            (promise => {
              if ('pending' === promise.status) throw promise
              if ('fulfilled' === promise.status) return promise.value
              throw 'rejected' === promise.status
                ? promise.reason
                : (attachPromiseStatus(promise), promise)
            }),
          continuablePromiseMap = new WeakMap(),
          createContinuablePromise = (promise, getValue) => {
            let continuablePromise = continuablePromiseMap.get(promise)
            return (
              continuablePromise ||
                ((continuablePromise = new Promise((resolve, reject) => {
                  let curr = promise
                  const onFulfilled = me => v => {
                      curr === me && resolve(v)
                    },
                    onRejected = me => e => {
                      curr === me && reject(e)
                    },
                    onAbort = () => {
                      try {
                        const nextValue = getValue()
                        isPromiseLike(nextValue)
                          ? (continuablePromiseMap.set(
                              nextValue,
                              continuablePromise
                            ),
                            (curr = nextValue),
                            nextValue.then(
                              onFulfilled(nextValue),
                              onRejected(nextValue)
                            ),
                            (0,
                            jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_2__.MO)(
                              nextValue,
                              onAbort
                            ))
                          : resolve(nextValue)
                      } catch (e) {
                        reject(e)
                      }
                    }
                  ;(promise.then(onFulfilled(promise), onRejected(promise)),
                    (0,
                    jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_2__.MO)(
                      promise,
                      onAbort
                    ))
                })),
                continuablePromiseMap.set(promise, continuablePromise)),
              continuablePromise
            )
          }
        function useAtomValue(atom, options) {
          const {
              delay,
              unstable_promiseStatus:
                promiseStatus = !react__WEBPACK_IMPORTED_MODULE_0__.use,
            } = options || {},
            store = useStore(options),
            [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] =
              (0, react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(
                prev => {
                  const nextValue = store.get(atom)
                  return Object.is(prev[0], nextValue) &&
                    prev[1] === store &&
                    prev[2] === atom
                    ? prev
                    : [nextValue, store, atom]
                },
                void 0,
                () => [store.get(atom), store, atom]
              )
          let value = valueFromReducer
          if (
            ((storeFromReducer === store && atomFromReducer === atom) ||
              (rerender(), (value = store.get(atom))),
            (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
              const unsub = store.sub(atom, () => {
                if (promiseStatus)
                  try {
                    const value2 = store.get(atom)
                    isPromiseLike(value2) &&
                      attachPromiseStatus(
                        createContinuablePromise(value2, () => store.get(atom))
                      )
                  } catch (e) {}
                'number' != typeof delay
                  ? rerender()
                  : setTimeout(rerender, delay)
              })
              return (rerender(), unsub)
            }, [store, atom, delay, promiseStatus]),
            (0, react__WEBPACK_IMPORTED_MODULE_0__.useDebugValue)(value),
            isPromiseLike(value))
          ) {
            const promise = createContinuablePromise(value, () =>
              store.get(atom)
            )
            return (promiseStatus && attachPromiseStatus(promise), use(promise))
          }
          return value
        }
        function useSetAtom(atom, options) {
          const store = useStore(options)
          return (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(
            (...args) => {
              if (!('write' in atom)) throw new Error('not writable atom')
              return store.set(atom, ...args)
            },
            [store, atom]
          )
        }
        function useAtom(atom, options) {
          return [useAtomValue(atom, options), useSetAtom(atom, options)]
        }
      },
      './node_modules/jotai/esm/vanilla.mjs': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          eU: () => atom,
          y$: () => createStore,
          zp: () => getDefaultStore,
        })
        var jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/jotai/esm/vanilla/internals.mjs'
            ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        let keyCount = 0
        function atom(read, write) {
          const key = 'atom' + ++keyCount,
            config = {
              toString() {
                return this.debugLabel ? key + ':' + this.debugLabel : key
              },
            }
          return (
            'function' == typeof read
              ? (config.read = read)
              : ((config.init = read),
                (config.read = defaultRead),
                (config.write = defaultWrite)),
            write && (config.write = write),
            config
          )
        }
        function defaultRead(get) {
          return get(this)
        }
        function defaultWrite(get, set, arg) {
          return set(this, 'function' == typeof arg ? arg(get(this)) : arg)
        }
        const createDevStoreRev4 = () => {
          let inRestoreAtom = 0
          const storeHooks = (0,
            jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_0__.eE)({}),
            atomStateMap = new WeakMap(),
            mountedAtoms = new WeakMap(),
            store = (0,
            jotai_vanilla_internals__WEBPACK_IMPORTED_MODULE_0__._w)(
              atomStateMap,
              mountedAtoms,
              void 0,
              void 0,
              void 0,
              void 0,
              storeHooks,
              void 0,
              (atom, get, set, ...args) =>
                inRestoreAtom
                  ? set(atom, ...args)
                  : atom.write(get, set, ...args)
            ),
            debugMountedAtoms = new Set()
          ;(storeHooks.m.add(void 0, atom => {
            debugMountedAtoms.add(atom)
            atomStateMap.get(atom).m = mountedAtoms.get(atom)
          }),
            storeHooks.u.add(void 0, atom => {
              debugMountedAtoms.delete(atom)
              delete atomStateMap.get(atom).m
            }))
          const devStore = {
            dev4_get_internal_weak_map: () => (
              console.log('Deprecated: Use devstore from the devtools library'),
              atomStateMap
            ),
            dev4_get_mounted_atoms: () => debugMountedAtoms,
            dev4_restore_atoms: values => {
              const restoreAtom = {
                read: () => null,
                write: (_get, set) => {
                  ++inRestoreAtom
                  try {
                    for (const [atom, value] of values)
                      'init' in atom && set(atom, value)
                  } finally {
                    --inRestoreAtom
                  }
                },
              }
              store.set(restoreAtom)
            },
          }
          return Object.assign(store, devStore)
        }
        let overiddenCreateStore, defaultStore
        function createStore() {
          return overiddenCreateStore
            ? overiddenCreateStore()
            : createDevStoreRev4()
        }
        function getDefaultStore() {
          return (
            defaultStore ||
              ((defaultStore = createStore()),
              globalThis.__JOTAI_DEFAULT_STORE__ ||
                (globalThis.__JOTAI_DEFAULT_STORE__ = defaultStore),
              globalThis.__JOTAI_DEFAULT_STORE__ !== defaultStore &&
                console.warn(
                  'Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044'
                )),
            defaultStore
          )
        }
      },
      './node_modules/jotai/esm/vanilla/internals.mjs': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          MO: () => INTERNAL_registerAbortHandler,
          _w: () => INTERNAL_buildStoreRev1,
          eE: () => INTERNAL_initializeStoreHooks,
        })
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const isSelfAtom = (atom, a) =>
            atom.unstable_is ? atom.unstable_is(a) : a === atom,
          hasInitialValue = atom => 'init' in atom,
          isActuallyWritableAtom = atom => !!atom.write,
          isAtomStateInitialized = atomState =>
            'v' in atomState || 'e' in atomState,
          returnAtomValue = atomState => {
            if ('e' in atomState) throw atomState.e
            if (!('v' in atomState))
              throw new Error('[Bug] atom state is not initialized')
            return atomState.v
          },
          promiseStateMap = new WeakMap(),
          isPendingPromise = value => {
            var _a
            return (
              isPromiseLike(value) &&
              !!(null == (_a = promiseStateMap.get(value)) ? void 0 : _a[0])
            )
          },
          abortPromise = promise => {
            const promiseState = promiseStateMap.get(promise)
            ;(null == promiseState ? void 0 : promiseState[0]) &&
              ((promiseState[0] = !1), promiseState[1].forEach(fn => fn()))
          },
          registerAbortHandler = (promise, abortHandler) => {
            let promiseState = promiseStateMap.get(promise)
            if (!promiseState) {
              ;((promiseState = [!0, new Set()]),
                promiseStateMap.set(promise, promiseState))
              const settle = () => {
                promiseState[0] = !1
              }
              promise.then(settle, settle)
            }
            promiseState[1].add(abortHandler)
          },
          isPromiseLike = p =>
            'function' == typeof (null == p ? void 0 : p.then),
          addPendingPromiseToDependency = (
            atom,
            promise,
            dependencyAtomState
          ) => {
            dependencyAtomState.p.has(atom) ||
              (dependencyAtomState.p.add(atom),
              promise.then(
                () => {
                  dependencyAtomState.p.delete(atom)
                },
                () => {
                  dependencyAtomState.p.delete(atom)
                }
              ))
          },
          setAtomStateValueOrPromise = (
            atom,
            valueOrPromise,
            ensureAtomState
          ) => {
            const atomState = ensureAtomState(atom),
              hasPrevValue = 'v' in atomState,
              prevValue = atomState.v
            if (isPromiseLike(valueOrPromise))
              for (const a of atomState.d.keys())
                addPendingPromiseToDependency(
                  atom,
                  valueOrPromise,
                  ensureAtomState(a)
                )
            ;((atomState.v = valueOrPromise),
              delete atomState.e,
              (hasPrevValue && Object.is(prevValue, atomState.v)) ||
                (++atomState.n,
                isPromiseLike(prevValue) && abortPromise(prevValue)))
          },
          getMountedOrPendingDependents = (atom, atomState, mountedMap) => {
            var _a
            const dependents = new Set()
            for (const a of (null == (_a = mountedMap.get(atom))
              ? void 0
              : _a.t) || [])
              mountedMap.has(a) && dependents.add(a)
            for (const atomWithPendingPromise of atomState.p)
              dependents.add(atomWithPendingPromise)
            return dependents
          },
          createStoreHookForAtoms = () => {
            const all = {},
              callbacks = new WeakMap(),
              notify = atom => {
                var _a, _b
                ;(null == (_a = callbacks.get(all)) ||
                  _a.forEach(fn => fn(atom)),
                  null == (_b = callbacks.get(atom)) || _b.forEach(fn => fn()))
              }
            return (
              (notify.add = (atom, fn) => {
                const key = atom || all,
                  fns = (
                    callbacks.has(key)
                      ? callbacks
                      : callbacks.set(key, new Set())
                  ).get(key)
                return (
                  fns.add(fn),
                  () => {
                    ;(null == fns || fns.delete(fn),
                      fns.size || callbacks.delete(key))
                  }
                )
              }),
              notify
            )
          },
          BUILDING_BLOCKS = Symbol(),
          INTERNAL_buildStoreRev1 = (
            atomStateMap = new WeakMap(),
            mountedMap = new WeakMap(),
            invalidatedAtoms = new WeakMap(),
            changedAtoms = new Set(),
            mountCallbacks = new Set(),
            unmountCallbacks = new Set(),
            storeHooks = {},
            atomRead = (atom, ...params) => atom.read(...params),
            atomWrite = (atom, ...params) => atom.write(...params),
            atomOnInit = (atom, store) => {
              var _a
              return null == (_a = atom.unstable_onInit)
                ? void 0
                : _a.call(atom, store)
            },
            atomOnMount = (atom, setAtom) => {
              var _a
              return null == (_a = atom.onMount)
                ? void 0
                : _a.call(atom, setAtom)
            },
            ...buildingBlockFunctions
          ) => {
            const ensureAtomState =
                buildingBlockFunctions[0] ||
                (atom => {
                  if (!atom) throw new Error('Atom is undefined or null')
                  let atomState = atomStateMap.get(atom)
                  return (
                    atomState ||
                      ((atomState = { d: new Map(), p: new Set(), n: 0 }),
                      atomStateMap.set(atom, atomState),
                      null == atomOnInit || atomOnInit(atom, store)),
                    atomState
                  )
                }),
              flushCallbacks =
                buildingBlockFunctions[1] ||
                (() => {
                  const errors = [],
                    call = fn => {
                      try {
                        fn()
                      } catch (e) {
                        errors.push(e)
                      }
                    }
                  do {
                    storeHooks.f && call(storeHooks.f)
                    const callbacks = new Set(),
                      add = callbacks.add.bind(callbacks)
                    ;(changedAtoms.forEach(atom => {
                      var _a
                      return null == (_a = mountedMap.get(atom))
                        ? void 0
                        : _a.l.forEach(add)
                    }),
                      changedAtoms.clear(),
                      unmountCallbacks.forEach(add),
                      unmountCallbacks.clear(),
                      mountCallbacks.forEach(add),
                      mountCallbacks.clear(),
                      callbacks.forEach(call),
                      changedAtoms.size && recomputeInvalidatedAtoms())
                  } while (
                    changedAtoms.size ||
                    unmountCallbacks.size ||
                    mountCallbacks.size
                  )
                  if (errors.length) throw new AggregateError(errors)
                }),
              recomputeInvalidatedAtoms =
                buildingBlockFunctions[2] ||
                (() => {
                  const topSortedReversed = [],
                    visiting = new WeakSet(),
                    visited = new WeakSet(),
                    stack = Array.from(changedAtoms)
                  for (; stack.length; ) {
                    const a = stack[stack.length - 1],
                      aState = ensureAtomState(a)
                    if (visited.has(a)) stack.pop()
                    else if (visiting.has(a)) {
                      if (invalidatedAtoms.get(a) === aState.n)
                        topSortedReversed.push([a, aState])
                      else if (invalidatedAtoms.has(a))
                        throw new Error('[Bug] invalidated atom exists')
                      ;(visited.add(a), stack.pop())
                    } else {
                      visiting.add(a)
                      for (const d of getMountedOrPendingDependents(
                        a,
                        aState,
                        mountedMap
                      ))
                        visiting.has(d) || stack.push(d)
                    }
                  }
                  for (let i = topSortedReversed.length - 1; i >= 0; --i) {
                    const [a, aState] = topSortedReversed[i]
                    let hasChangedDeps = !1
                    for (const dep of aState.d.keys())
                      if (dep !== a && changedAtoms.has(dep)) {
                        hasChangedDeps = !0
                        break
                      }
                    ;(hasChangedDeps &&
                      (readAtomState(a), mountDependencies(a)),
                      invalidatedAtoms.delete(a))
                  }
                }),
              readAtomState =
                buildingBlockFunctions[3] ||
                (atom => {
                  var _a
                  const atomState = ensureAtomState(atom)
                  if (isAtomStateInitialized(atomState)) {
                    if (
                      mountedMap.has(atom) &&
                      invalidatedAtoms.get(atom) !== atomState.n
                    )
                      return atomState
                    if (
                      Array.from(atomState.d).every(
                        ([a, n]) => readAtomState(a).n === n
                      )
                    )
                      return atomState
                  }
                  atomState.d.clear()
                  let isSync = !0
                  const mountDependenciesIfAsync = () => {
                      mountedMap.has(atom) &&
                        (mountDependencies(atom),
                        recomputeInvalidatedAtoms(),
                        flushCallbacks())
                    },
                    getter = a => {
                      var _a2
                      if (isSelfAtom(atom, a)) {
                        const aState2 = ensureAtomState(a)
                        if (!isAtomStateInitialized(aState2)) {
                          if (!hasInitialValue(a))
                            throw new Error('no atom init')
                          setAtomStateValueOrPromise(a, a.init, ensureAtomState)
                        }
                        return returnAtomValue(aState2)
                      }
                      const aState = readAtomState(a)
                      try {
                        return returnAtomValue(aState)
                      } finally {
                        ;(atomState.d.set(a, aState.n),
                          isPendingPromise(atomState.v) &&
                            addPendingPromiseToDependency(
                              atom,
                              atomState.v,
                              aState
                            ),
                          null == (_a2 = mountedMap.get(a)) || _a2.t.add(atom),
                          isSync || mountDependenciesIfAsync())
                      }
                    }
                  let controller, setSelf
                  const options = {
                      get signal() {
                        return (
                          controller || (controller = new AbortController()),
                          controller.signal
                        )
                      },
                      get setSelf() {
                        return (
                          isActuallyWritableAtom(atom) ||
                            console.warn(
                              'setSelf function cannot be used with read-only atom'
                            ),
                          !setSelf &&
                            isActuallyWritableAtom(atom) &&
                            (setSelf = (...args) => {
                              if (
                                (isSync &&
                                  console.warn(
                                    'setSelf function cannot be called in sync'
                                  ),
                                !isSync)
                              )
                                try {
                                  return writeAtomState(atom, ...args)
                                } finally {
                                  ;(recomputeInvalidatedAtoms(),
                                    flushCallbacks())
                                }
                            }),
                          setSelf
                        )
                      },
                    },
                    prevEpochNumber = atomState.n
                  try {
                    const valueOrPromise = atomRead(atom, getter, options)
                    return (
                      setAtomStateValueOrPromise(
                        atom,
                        valueOrPromise,
                        ensureAtomState
                      ),
                      isPromiseLike(valueOrPromise) &&
                        (registerAbortHandler(valueOrPromise, () =>
                          null == controller ? void 0 : controller.abort()
                        ),
                        valueOrPromise.then(
                          mountDependenciesIfAsync,
                          mountDependenciesIfAsync
                        )),
                      atomState
                    )
                  } catch (error) {
                    return (
                      delete atomState.v,
                      (atomState.e = error),
                      ++atomState.n,
                      atomState
                    )
                  } finally {
                    ;((isSync = !1),
                      prevEpochNumber !== atomState.n &&
                        invalidatedAtoms.get(atom) === prevEpochNumber &&
                        (invalidatedAtoms.set(atom, atomState.n),
                        changedAtoms.add(atom),
                        null == (_a = storeHooks.c) ||
                          _a.call(storeHooks, atom)))
                  }
                }),
              invalidateDependents =
                buildingBlockFunctions[4] ||
                (atom => {
                  const stack = [atom]
                  for (; stack.length; ) {
                    const a = stack.pop(),
                      aState = ensureAtomState(a)
                    for (const d of getMountedOrPendingDependents(
                      a,
                      aState,
                      mountedMap
                    )) {
                      const dState = ensureAtomState(d)
                      ;(invalidatedAtoms.set(d, dState.n), stack.push(d))
                    }
                  }
                }),
              writeAtomState =
                buildingBlockFunctions[5] ||
                ((atom, ...args) => {
                  let isSync = !0
                  const getter = a => returnAtomValue(readAtomState(a)),
                    setter = (a, ...args2) => {
                      var _a
                      const aState = ensureAtomState(a)
                      try {
                        if (isSelfAtom(atom, a)) {
                          if (!hasInitialValue(a))
                            throw new Error('atom not writable')
                          const prevEpochNumber = aState.n,
                            v = args2[0]
                          return (
                            setAtomStateValueOrPromise(a, v, ensureAtomState),
                            mountDependencies(a),
                            void (
                              prevEpochNumber !== aState.n &&
                              (changedAtoms.add(a),
                              null == (_a = storeHooks.c) ||
                                _a.call(storeHooks, a),
                              invalidateDependents(a))
                            )
                          )
                        }
                        return writeAtomState(a, ...args2)
                      } finally {
                        isSync ||
                          (recomputeInvalidatedAtoms(), flushCallbacks())
                      }
                    }
                  try {
                    return atomWrite(atom, getter, setter, ...args)
                  } finally {
                    isSync = !1
                  }
                }),
              mountDependencies =
                buildingBlockFunctions[6] ||
                (atom => {
                  var _a
                  const atomState = ensureAtomState(atom),
                    mounted = mountedMap.get(atom)
                  if (mounted && !isPendingPromise(atomState.v)) {
                    for (const [a, n] of atomState.d)
                      if (!mounted.d.has(a)) {
                        const aState = ensureAtomState(a)
                        ;(mountAtom(a).t.add(atom),
                          mounted.d.add(a),
                          n !== aState.n &&
                            (changedAtoms.add(a),
                            null == (_a = storeHooks.c) ||
                              _a.call(storeHooks, a),
                            invalidateDependents(a)))
                      }
                    for (const a of mounted.d || [])
                      if (!atomState.d.has(a)) {
                        mounted.d.delete(a)
                        const aMounted = unmountAtom(a)
                        null == aMounted || aMounted.t.delete(atom)
                      }
                  }
                }),
              mountAtom =
                buildingBlockFunctions[7] ||
                (atom => {
                  var _a
                  const atomState = ensureAtomState(atom)
                  let mounted = mountedMap.get(atom)
                  if (!mounted) {
                    readAtomState(atom)
                    for (const a of atomState.d.keys()) {
                      mountAtom(a).t.add(atom)
                    }
                    if (
                      ((mounted = {
                        l: new Set(),
                        d: new Set(atomState.d.keys()),
                        t: new Set(),
                      }),
                      mountedMap.set(atom, mounted),
                      null == (_a = storeHooks.m) || _a.call(storeHooks, atom),
                      isActuallyWritableAtom(atom))
                    ) {
                      const processOnMount = () => {
                        let isSync = !0
                        const setAtom = (...args) => {
                          try {
                            return writeAtomState(atom, ...args)
                          } finally {
                            isSync ||
                              (recomputeInvalidatedAtoms(), flushCallbacks())
                          }
                        }
                        try {
                          const onUnmount = atomOnMount(atom, setAtom)
                          onUnmount &&
                            (mounted.u = () => {
                              isSync = !0
                              try {
                                onUnmount()
                              } finally {
                                isSync = !1
                              }
                            })
                        } finally {
                          isSync = !1
                        }
                      }
                      mountCallbacks.add(processOnMount)
                    }
                  }
                  return mounted
                }),
              unmountAtom =
                buildingBlockFunctions[8] ||
                (atom => {
                  var _a
                  const atomState = ensureAtomState(atom)
                  let mounted = mountedMap.get(atom)
                  if (
                    !mounted ||
                    mounted.l.size ||
                    Array.from(mounted.t).some(a => {
                      var _a2
                      return null == (_a2 = mountedMap.get(a))
                        ? void 0
                        : _a2.d.has(atom)
                    })
                  )
                    return mounted
                  ;(mounted.u && unmountCallbacks.add(mounted.u),
                    (mounted = void 0),
                    mountedMap.delete(atom),
                    null == (_a = storeHooks.u) || _a.call(storeHooks, atom))
                  for (const a of atomState.d.keys()) {
                    const aMounted = unmountAtom(a)
                    null == aMounted || aMounted.t.delete(atom)
                  }
                }),
              buildingBlocks = [
                atomStateMap,
                mountedMap,
                invalidatedAtoms,
                changedAtoms,
                mountCallbacks,
                unmountCallbacks,
                storeHooks,
                atomRead,
                atomWrite,
                atomOnInit,
                atomOnMount,
                ensureAtomState,
                flushCallbacks,
                recomputeInvalidatedAtoms,
                readAtomState,
                invalidateDependents,
                writeAtomState,
                mountDependencies,
                mountAtom,
                unmountAtom,
              ],
              store = {
                get: atom => returnAtomValue(readAtomState(atom)),
                set: (atom, ...args) => {
                  try {
                    return writeAtomState(atom, ...args)
                  } finally {
                    ;(recomputeInvalidatedAtoms(), flushCallbacks())
                  }
                },
                sub: (atom, listener) => {
                  const listeners = mountAtom(atom).l
                  return (
                    listeners.add(listener),
                    flushCallbacks(),
                    () => {
                      ;(listeners.delete(listener),
                        unmountAtom(atom),
                        flushCallbacks())
                    }
                  )
                },
              }
            return (
              Object.defineProperty(store, BUILDING_BLOCKS, {
                value: buildingBlocks,
              }),
              store
            )
          },
          INTERNAL_initializeStoreHooks = storeHooks => (
            storeHooks.c || (storeHooks.c = createStoreHookForAtoms()),
            storeHooks.m || (storeHooks.m = createStoreHookForAtoms()),
            storeHooks.u || (storeHooks.u = createStoreHookForAtoms()),
            storeHooks.f ||
              (storeHooks.f = (() => {
                const callbacks = new Set(),
                  notify = () => {
                    callbacks.forEach(fn => fn())
                  }
                return (
                  (notify.add = fn => (
                    callbacks.add(fn),
                    () => {
                      callbacks.delete(fn)
                    }
                  )),
                  notify
                )
              })()),
            storeHooks
          ),
          INTERNAL_registerAbortHandler = registerAbortHandler
      },
    },
  ]
)
