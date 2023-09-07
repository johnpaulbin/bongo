import { BingReturnType } from '@/lib/hooks/use-bing'

const exampleMessages = [
  {
    heading: '🧐 Ask complex questions',
    message: `What can I cook for my picky kid who only eats oranges?`
  },
  {
    heading: '🙌 Get balanced answers',
    message: 'What are the pros and cons of the top 3 best-selling pet vacuums?'
  },
  {
    heading: '🎨 Get creative responses',
    message: `Write a haiku about a crocodile in outer space in the voice of a pirate.`
  }
]

export function WelcomeScreen({ setInput }: Pick<BingReturnType, 'setInput'>) {
  return (
    <div className="welcome-container flex">
      {exampleMessages.map(example => (
        <button key={example.heading} className="welcome-item w-4/5 sm:w-[240px]" type="button" onClick={() => setInput(example.message)}>
          <div className="item-title">{example.heading}</div>
          <div className="item-content">
            <div className="item-body">
              <div className="item-header"></div>
              <div>&ldquo;{example.message}&rdquo;</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
