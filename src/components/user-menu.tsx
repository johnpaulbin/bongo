'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import pkg from '../../package.json'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconCopy, IconExternalLink, IconGitHub } from '@/components/ui/icons'
import SettingIcon from '@/assets/images/settings.svg'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { SVG } from './ui/svg'

export function UserMenu() {
  const [host, setHost] = useState('')
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  useEffect(() => {
    setHost(location.host)
  }, [])

  useEffect(() => {
    if (isCopied) {
      toast.success('Copied!')
    }
  }, [isCopied])
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="pl-0" variant="secondary">
            <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-7 w-7 shrink-0 bg-muted/50 text-muted-foreground">
              <SVG alt="settings" src={SettingIcon} width={20} />
            </div>
            <span className="ml-2">Setup</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px] bg-background">
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="settings"'
            }
            className="cursor-pointer"
          >
            Set user
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="voice"'
            }
            className="cursor-pointer"
          >
            Voice Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start">
            <div className="font-medium">Version {pkg.version}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start">
            <div className="font-medium">Domain name</div>
            <div onClick={() => copyToClipboard(host)} className="flex gap-1 text-xs text-zinc-500 cursor-pointer">
              {host} <IconCopy />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
