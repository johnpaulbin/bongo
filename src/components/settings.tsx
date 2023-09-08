import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { Switch } from '@headlessui/react'
import { toast } from 'react-hot-toast'
import { hashAtom, historyAtom, isImageOnly, voiceAtom } from '@/state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChunkKeys, parseCookies, extraCurlFromCookie, encodeHeadersToCookie, getCookie, setCookie } from '@/lib/utils'
import { ExternalLink } from './external-link'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'

export function Settings() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [loc, setLoc] = useAtom(hashAtom)
  const [curlValue, setCurlValue] = useState(extraCurlFromCookie(parseCookies(document.cookie, ChunkKeys)))
  const [imageOnly, setImageOnly] = useState(isImageOnly)
  const [enabledHistory, setHistory] = useAtom(historyAtom)
  const [enableTTS, setEnableTTS] = useAtom(voiceAtom)

  useEffect(() => {
    if (isCopied) {
      toast.success('Copied!')
    }
  }, [isCopied])

  const handleSwitchImageOnly = useCallback((checked: boolean) => {
    let headerValue = curlValue
    if (headerValue) {
      try {
        headerValue = atob(headerValue)
      } catch (e) { }
      if (!/^\s*curl ['"]https:\/\/(www|cn)\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
        toast.error('User information format is incorrect')
        return
      }
      if (RegExp.$1 === 'cn' && checked === false) {
        toast.error('你配置的中文域名 cn.bing.com 仅支持画图')
        return
      }
      setImageOnly(checked)
    } else {
      toast.error('Please configure user information first')
    }
  }, [curlValue])

  if (loc === 'settings') {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set up your user information</DialogTitle>
            <DialogDescription>
              Please use the Microsoft Edge browser
              <ExternalLink
                href="https://www.bing.com"
              >
                Open and sign in to Bing
              </ExternalLink>
               then open
              <ExternalLink href="https://www.bing.com/turing/captcha/challenge">Challenge interface</ExternalLink>
              Right click > Inspect. Open the developer tools, find the Challenge interface in the network, right-click and copy, copy as cURL (bash), paste it here, and save.
              <div className="h-2" />
              Image example:
              <ExternalLink href="https://github.com/weaigc/bingo#如何获取%20BING_HEADER">How to get the BING HEADER:</ExternalLink>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">

          </div>
          <Input
            value={curlValue}
            placeholder="Fill in the user information here. Format: curl 'https://www.bing.com/turing/captcha/challenge' ..."
            onChange={e => setCurlValue(e.target.value)}
          />
          <div className="flex gap-2">
            <Switch
              checked={imageOnly}
              className={`${imageOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => handleSwitchImageOnly(checked)}
            >
              <span
                className={`${imageOnly ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            User information is only used for drawing (used when the account is abnormal)
          </div>

          {!imageOnly && (
            <div className="flex gap-2">
              <Switch
                checked={enabledHistory}
                className={`${enabledHistory ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                onChange={(checked: boolean) => setHistory(checked)}
              >
                <span
                  className={`${enabledHistory ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              enable history
            </div>
          )}

          <Button variant="ghost" className="bg-[#F5F5F5] hover:bg-[#F2F2F2]" onClick={() => copyToClipboard(btoa(curlValue))}>
            Convert to BING_HEADER and copy
          </Button>

          <DialogFooter className="items-center">
            <Button
              variant="secondary"
              className="bg-[#c7f3ff] hover:bg-[#fdc7ff]"
              onClick={() => {
                let headerValue = curlValue
                if (headerValue) {
                  try {
                    headerValue = atob(headerValue)
                  } catch (e) { }
                  if (!/^\s*curl ['"]https:\/\/(www|cn)\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
                    toast.error('User information format is incorrect')
                    return
                  }
                  const maxAge = 86400 * 30
                  encodeHeadersToCookie(headerValue).forEach(cookie => document.cookie = `${cookie}; Max-Age=${maxAge}; Path=/; SameSite=None; Secure`)
                } else {
                  [...ChunkKeys, 'BING_COOKIE', 'BING_UA', 'BING_IP', '_U'].forEach(key => setCookie(key, ''))
                }
                setCookie('IMAGE_ONLY', RegExp.$1 === 'cn' || imageOnly || !headerValue ? '1' : '0')

                toast.success('Saved successfully')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              keep
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  } else if (loc === 'voice') {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>voice settings</DialogTitle>
            <DialogDescription>
              Currently only supports Edge and Chrome browsers on PC
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            Enable voice answers
            <Switch
              checked={enableTTS}
              className={`${enableTTS ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => setEnableTTS(checked)}
            >
              <span
                className={`${enableTTS ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <DialogFooter className="items-center">
            <Button
              variant="secondary"
              onClick={() => {
                toast.success('Saved successfully')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              keep
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return null
}
