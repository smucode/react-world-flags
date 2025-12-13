'use client'

import {
  useState,
  useEffect,
  type ReactNode,
  type ImgHTMLAttributes,
} from 'react'
import { getAlphaTwoCode } from './country'

export interface FlagProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  code: string
  fallback?: ReactNode
}

const flagModules = import.meta.glob<{ default: string }>('./svgs/*.svg')

const flagCache = new Map<string, string>()

const Flag = ({ code, fallback = null, ...rest }: FlagProps): ReactNode => {
  const [src, setSrc] = useState<string | null>(() => {
    if (!code) return null
    const alphaTwo = getAlphaTwoCode(code)
    const key = alphaTwo.toLowerCase().replace('_', '-')
    return flagCache.get(key) ?? null
  })

  useEffect(() => {
    if (!code) {
      setSrc(null)
      return
    }

    const alphaTwo = getAlphaTwoCode(code)
    const key = alphaTwo.toLowerCase().replace('_', '-')

    if (flagCache.has(key)) {
      setSrc(flagCache.get(key)!)
      return
    }

    const modulePath = `./svgs/${key}.svg`
    const loader = flagModules[modulePath]

    if (!loader) {
      setSrc(null)
      return
    }

    let cancelled = false

    loader()
      .then((module) => {
        if (!cancelled) {
          flagCache.set(key, module.default)
          setSrc(module.default)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSrc(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code])

  if (!code || !src) return fallback
  return <img {...rest} src={src} />
}

export default Flag
