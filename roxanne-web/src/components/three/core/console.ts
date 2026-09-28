import { getConsoleFunction, setConsoleFunction } from 'three'

/*
 * three r183 deprecated THREE.Clock and warns when one is constructed, but
 * @react-three/fiber 9.8 still creates one per canvas internally. Drop exactly
 * that notice (it is not actionable from app code); every other three.js
 * message is forwarded to the console unchanged.
 */
const IGNORED = ['THREE.Clock: This module has been deprecated']

if (typeof window !== 'undefined' && !getConsoleFunction()) {
  setConsoleFunction((type, message, ...params) => {
    if (type === 'warn' && IGNORED.some((text) => message.startsWith(text))) return
    console[type](message, ...params)
  })
}
