import { h } from 'preact'
import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <h1>Penpot Plugin</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count: {count}
        </button>
        <p>
          This React/Preact content is now visible in Penpot
        </p>
      </div>
    </div>
  )
}
