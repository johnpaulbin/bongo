import IconWarning from '@/assets/images/warning.svg'
import { ChatError, ErrorCode, ChatMessageModel } from '@/lib/bots/bing/types'
import { ExternalLink } from './external-link'
import { BingReturnType } from '@/lib/hooks/use-bing'
import { SVG } from './ui/svg'

export interface ChatNotificationProps extends Pick<BingReturnType, 'bot'> {
  message?: ChatMessageModel
}

function getAction(error: ChatError, reset: () => void) {
  if (error.code === ErrorCode.THROTTLE_LIMIT) {
    reset()
    return (
      <div>
        You reached the maximum number of messages you can send today. <a href={`#dialog="settings"`}></a> Change your account or try later.
      </div>
    )
  }
  if (error.code === ErrorCode.BING_IP_FORBIDDEN) {
    return (
      <ExternalLink href="https://github.com/weaigc/bingo/issues">
        Your server or proxy has been banned, please change the server or use a proxy and try again.
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.BING_TRY_LATER) {
    return (
      <a href={`#dialog="reset"`}>
        Session creation failed, please retry manually.
      </a>
    )
  }
  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <ExternalLink href="https://bing.com/new">
        Your account has been blacklisted, please try to change your account and apply for unblocking.
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return (
      <div>
        The current topic has been suspended, please click
        <a href={`#dialog="reset"`}>the restart button</a>
        to try again.
      </div>
    )
  }
  if (error.code === ErrorCode.BING_CAPTCHA) {
    return (
      <ExternalLink href="https://www.bing.com/turing/captcha/challenge">
        Complete the captcha
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    reset()
    return (
      <a href={`#dialog="settings"`}>The user information could not be obtained or the user information is invalid, click here to reset.</a>
    )
  }
  if (error.code === ErrorCode.BING_IMAGE_UNAUTHORIZED) {
    reset()
    return (
      <a href={`#dialog="settings"`}></a>Drawing requires user information, the system has not obtained valid user information, click here to set.</a>
    )
  }
  return error.message
}

export function ChatNotification({ message, bot }: ChatNotificationProps) {
  if (!message?.error) return

  return (
    <div
      className="notification-container"
    >
      <div className="bottom-notifications">
        <div className="inline-type with-decorative-line">
          <div className="text-container mt-1">
            <div className="title inline-flex items-start">
              <SVG alt="error" src={IconWarning} width={20} className="mr-1 mt-1" />
              {getAction(message.error, () => bot.resetConversation())}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
