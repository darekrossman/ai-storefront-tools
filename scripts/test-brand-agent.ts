interface Message {
  role: 'user' | 'assistant'
  content: string
}

let sessionState: any
let messages: Message[] = [
  {
    role: 'user',
    content:
      'I want to create a brand for a sustainable fashion startup targeting eco-conscious millennials.',
  },
]

const sendPrompt = async (step?: number | undefined) => {
  const res = await fetch('http://localhost:3000/api/agents/brand', {
    method: 'POST',
    body: JSON.stringify({ messages, sessionState }),
  })

  const { object } = await res.json()

  if (step !== undefined) {
    saveResultToFile(object, step)
  }

  return object
}

const main = async () => {
  let phase = 1

  while (phase <= 5) {
    const result = await sendPrompt()

    console.log(`========================================== ${phase}`)
    console.dir(result, { depth: null })

    messages.push({ role: 'assistant', content: JSON.stringify(result) })

    messages.push({
      role: 'user',
      content: 'I like the first option',
    })

    const obj = Object.values(result)[0] as { phase: number }
    phase = obj.phase
  }
}

main()

// ==========================================
// Helper Functions
// ==========================================

function saveResultToFile(result: any, step: number) {
  const fs = require('fs')
  const path = require('path')
  const outputDir = path.join(__dirname, 'output')
  const outputFile = path.join(outputDir, `result-step-${step}.json`)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))
}

function getResultFromFile(step: number) {
  const fs = require('fs')
  const path = require('path')
  const outputDir = path.join(__dirname, 'output')
  const outputFile = path.join(outputDir, `result-step-${step}.json`)
  return JSON.parse(fs.readFileSync(outputFile, 'utf8'))
}
