const bucket = new WeakMap()
const data = { ok: true, text: 'hello world' }
let activeEffect = null

function effect(fn) {
  activeEffect = fn
  fn()
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },

  set(target, key, newValue) {
    target[key] = newValue
    trigger(target, key)
  }
})

/**
 * 追踪
 * @param {object} target 即 data
 * @param {*} key
 * @returns
 */
function track(target, key) {
  if (!activeEffect) return

  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects & effects.forEach((fn) => fn())
}

effect(() => {
  document.body.innerText = obj.text
})