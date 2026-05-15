import { useState } from 'react'

interface Props {
  onAnalyze: (text: string) => void
  loading: boolean
}

const exampleTweets = [
  "My flight was delayed for 3 hours and no one helped me",
  "Amazing service from the crew, best flight ever!",
  "Flight is on time, nothing special to report",
  "Lost my luggage and customer service was terrible",
  "Thank you for the smooth boarding experience!"
]

export default function AnalyzeForm({ onAnalyze, loading }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim()) onAnalyze(text.trim())
  }

  const handleExample = (tweet: string) => {
    setText(tweet)
  }

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid #2a2a4a'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#a78bfa' }}>
        ✍️ Analyze Tweet
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste a tweet here..."
        rows={4}
        style={{
          width: '100%',
          background: '#0f0f1a',
          border: '1px solid #2a2a4a',
          borderRadius: '10px',
          padding: '14px',
          color: '#ffffff',
          fontSize: '15px',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '14px',
          background: loading || !text.trim() ? '#2a2a4a' : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {loading ? '🔄 Analyzing...' : '🔮 Analyze Sentiment'}
      </button>

      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
          💡 Try an example:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {exampleTweets.map((tweet, i) => (
            <button
              key={i}
              onClick={() => handleExample(tweet)}
              style={{
                background: '#0f0f1a',
                border: '1px solid #2a2a4a',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#9ca3af',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              "{tweet}"
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}