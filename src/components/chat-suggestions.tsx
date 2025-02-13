import React, { useEffect, useMemo } from 'react'
import { atom, useAtom } from 'jotai'
import HelpIcon from '@/assets/images/help.svg'
import DismissFillIcon from '@/assets/images/dismiss-fill.svg'
import { SuggestedResponse } from '@/lib/bots/bing/types'
import { BingReturnType } from '@/lib/hooks/use-bing'
import { SVG } from './ui/svg'

type Suggestions = SuggestedResponse[]
const helpSuggestions = ["Research today's news in stocks and summerize it for me.", 'Tell me about Bing.', "How's the weather in San Francisco?"].map((text) => ({ text }))
const suggestionsAtom = atom<Suggestions>([])

type ChatSuggestionsProps = React.ComponentProps<'div'> & Pick<BingReturnType, 'setInput'> & { suggestions?: Suggestions }

export function ChatSuggestions({ setInput, suggestions = [] }: ChatSuggestionsProps) {
  const [currentSuggestions, setSuggestions] = useAtom(suggestionsAtom)
  const toggleSuggestions = (() => {
    if (currentSuggestions === helpSuggestions) {
      setSuggestions(suggestions)
    } else {
      setSuggestions(helpSuggestions)
    }
  })

  useMemo(() => {
    setSuggestions(suggestions)
  }, [suggestions, setSuggestions])

  useEffect(() => {
    setTimeout(() => {
      window.scrollBy(0, 800)
    }, 200)
  }, [])

  return currentSuggestions?.length ? (
    <div className="py-6">
      <div className="suggestion-items">
        <button className="rai-button" type="button" aria-label="What's this?" onClick={toggleSuggestions}>
          <SVG alt="help" src={currentSuggestions === helpSuggestions ? DismissFillIcon : HelpIcon} width={24} />
        </button>
        {
          currentSuggestions.map(suggestion => (
            <button key={suggestion.text} className="body-1-strong suggestion-container" type="button" onClick={() => setInput(suggestion.text)}>
              {suggestion.text}
            </button>
          ))
        }
      </div>
    </div>
  ) : null
}
