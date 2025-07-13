'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [936],
    {
      './node_modules/jotai/esm/vanilla/utils.mjs': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          tG: () => atomWithStorage,
        })
        var jotai_vanilla__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            './node_modules/jotai/esm/vanilla.mjs'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const RESET = Symbol('RESET')
        const isPromiseLike$3 = x =>
          'function' == typeof (null == x ? void 0 : x.then)
        const defaultStorage = (function createJSONStorage(
          getStringStorage = () => {
            try {
              return window.localStorage
            } catch (e) {
              return void ('undefined' != typeof window && console.warn(e))
            }
          },
          options
        ) {
          var _a
          let lastStr, lastValue
          const storage = {
            getItem: (key, initialValue) => {
              var _a2, _b
              const parse = str2 => {
                  if (lastStr !== (str2 = str2 || '')) {
                    try {
                      lastValue = JSON.parse(
                        str2,
                        null == options ? void 0 : options.reviver
                      )
                    } catch (e) {
                      return initialValue
                    }
                    lastStr = str2
                  }
                  return lastValue
                },
                str =
                  null !=
                  (_b =
                    null == (_a2 = getStringStorage())
                      ? void 0
                      : _a2.getItem(key))
                    ? _b
                    : null
              return isPromiseLike$3(str) ? str.then(parse) : parse(str)
            },
            setItem: (key, newValue) => {
              var _a2
              return null == (_a2 = getStringStorage())
                ? void 0
                : _a2.setItem(
                    key,
                    JSON.stringify(
                      newValue,
                      null == options ? void 0 : options.replacer
                    )
                  )
            },
            removeItem: key => {
              var _a2
              return null == (_a2 = getStringStorage())
                ? void 0
                : _a2.removeItem(key)
            },
          }
          let subscriber
          try {
            subscriber =
              null == (_a = getStringStorage()) ? void 0 : _a.subscribe
          } catch (e) {}
          var subscriber2
          return (
            !subscriber &&
              'undefined' != typeof window &&
              'function' == typeof window.addEventListener &&
              window.Storage &&
              (subscriber = (key, callback) => {
                if (!(getStringStorage() instanceof window.Storage))
                  return () => {}
                const storageEventCallback = e => {
                  e.storageArea === getStringStorage() &&
                    e.key === key &&
                    callback(e.newValue)
                }
                return (
                  window.addEventListener('storage', storageEventCallback),
                  () => {
                    window.removeEventListener('storage', storageEventCallback)
                  }
                )
              }),
            subscriber &&
              (storage.subscribe =
                ((subscriber2 = subscriber),
                (key, callback, initialValue) =>
                  subscriber2(key, v => {
                    let newValue
                    try {
                      newValue = JSON.parse(v || '')
                    } catch (e) {
                      newValue = initialValue
                    }
                    callback(newValue)
                  }))),
            storage
          )
        })()
        function atomWithStorage(
          key,
          initialValue,
          storage = defaultStorage,
          options
        ) {
          const getOnInit = null == options ? void 0 : options.getOnInit,
            baseAtom = (0, jotai_vanilla__WEBPACK_IMPORTED_MODULE_0__.eU)(
              getOnInit ? storage.getItem(key, initialValue) : initialValue
            )
          ;((baseAtom.debugPrivate = !0),
            (baseAtom.onMount = setAtom => {
              let unsub
              return (
                setAtom(storage.getItem(key, initialValue)),
                storage.subscribe &&
                  (unsub = storage.subscribe(key, setAtom, initialValue)),
                unsub
              )
            }))
          return (0, jotai_vanilla__WEBPACK_IMPORTED_MODULE_0__.eU)(
            get => get(baseAtom),
            (get, set, update) => {
              const nextValue =
                'function' == typeof update ? update(get(baseAtom)) : update
              return nextValue === RESET
                ? (set(baseAtom, initialValue), storage.removeItem(key))
                : isPromiseLike$3(nextValue)
                  ? nextValue.then(
                      resolvedValue => (
                        set(baseAtom, resolvedValue),
                        storage.setItem(key, resolvedValue)
                      )
                    )
                  : (set(baseAtom, nextValue), storage.setItem(key, nextValue))
            }
          )
        }
      },
    },
  ]
)
