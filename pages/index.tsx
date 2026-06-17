import { useState, useEffect } from 'react'
import Head from 'next/head'

interface BoardMember {
  id: string
  name: string
  description: string
}

interface Council {
  id: string
  name: string
  description: string
  boardMembers: BoardMember[]
  createdAt: string
}

export default function Home() {
  const [councils, setCouncils] = useState<Council[]>([])
  const [newCouncilName, setNewCouncilName] = useState('')
  const [newCouncilDescription, setNewCouncilDescription] = useState('')
  const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberDescription, setNewMemberDescription] = useState('')
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Load councils from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('councils')
    if (saved) {
      setCouncils(JSON.parse(saved))
    }
  }, [])

  // Save councils to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('councils', JSON.stringify(councils))
  }, [councils])

  const createCouncil = () => {
    if (!newCouncilName.trim()) return

    const newCouncil: Council = {
      id: Date.now().toString(),
      name: newCouncilName,
      description: newCouncilDescription,
      boardMembers: [],
      createdAt: new Date().toISOString(),
    }

    setCouncils([...councils, newCouncil])
    setNewCouncilName('')
    setNewCouncilDescription('')
    setSelectedCouncil(newCouncil)
  }

  const addBoardMember = () => {
    if (!selectedCouncil || !newMemberName.trim()) return

    const newMember: BoardMember = {
      id: Date.now().toString(),
      name: newMemberName,
      description: newMemberDescription,
    }

    const updatedCouncil = {
      ...selectedCouncil,
      boardMembers: [...selectedCouncil.boardMembers, newMember],
    }

    setCouncils(councils.map(c => (c.id === selectedCouncil.id ? updatedCouncil : c)))
    setSelectedCouncil(updatedCouncil)
    setNewMemberName('')
    setNewMemberDescription('')
  }

  const askCouncil = async () => {
    if (!selectedCouncil || !query.trim() || selectedCouncil.boardMembers.length === 0) return

    setLoading(true)
    setResponse('')

    try {
      const response = await fetch('/api/ask-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          boardMembers: selectedCouncil.boardMembers,
        }),
      })

      const data = await response.json()
      setResponse(data.response || 'No response generated')
    } catch (error) {
      setResponse('Error generating response. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMember = (memberId: string) => {
    if (!selectedCouncil) return

    const updatedCouncil = {
      ...selectedCouncil,
      boardMembers: selectedCouncil.boardMembers.filter(m => m.id !== memberId),
    }

    setCouncils(councils.map(c => (c.id === selectedCouncil.id ? updatedCouncil : c)))
    setSelectedCouncil(updatedCouncil)
  }

  const deleteCouncil = (councilId: string) => {
    setCouncils(councils.filter(c => c.id !== councilId))
    if (selectedCouncil?.id === councilId) {
      setSelectedCouncil(null)
    }
  }

  return (
    <>
      <Head>
        <title>Council - Board of Directors</title>
        <meta name="description" content="Assemble a board of directors with different worldviews" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">
        <h1>🏛️ Council</h1>
        <p className="subtitle">Assemble a board of directors to help guide your decisions</p>

        <section className="section">
          <h2>Create a Council</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Council name (e.g., Tech Strategy Board)"
              value={newCouncilName}
              onChange={(e) => setNewCouncilName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCouncilDescription}
              onChange={(e) => setNewCouncilDescription(e.target.value)}
            />
            <button onClick={createCouncil}>Create Council</button>
          </div>
        </section>

        {councils.length > 0 && (
          <section className="section">
            <h2>Your Councils</h2>
            <div className="councils-list">
              {councils.map((council) => (
                <div
                  key={council.id}
                  className={`council-card ${selectedCouncil?.id === council.id ? 'active' : ''}`}
                >
                  <div onClick={() => setSelectedCouncil(council)}>
                    <h3>{council.name}</h3>
                    <p>{council.description}</p>
                    <small>Members: {council.boardMembers.length}</small>
                  </div>
                  <button onClick={() => deleteCouncil(council.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedCouncil && (
          <>
            <section className="section">
              <h2>Board Members: {selectedCouncil.name}</h2>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Member name (e.g., Elon Musk)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Their worldview/expertise (e.g., Tech innovator, visionary)"
                  value={newMemberDescription}
                  onChange={(e) => setNewMemberDescription(e.target.value)}
                />
                <button onClick={addBoardMember}>Add Member</button>
              </div>

              {selectedCouncil.boardMembers.length > 0 && (
                <div className="members-list">
                  {selectedCouncil.boardMembers.map((member) => (
                    <div key={member.id} className="member-card">
                      <div>
                        <h4>{member.name}</h4>
                        <p>{member.description}</p>
                      </div>
                      <button onClick={() => deleteMember(member.id)} className="delete-btn">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {selectedCouncil.boardMembers.length > 0 && (
              <section className="section">
                <h2>Ask Your Council</h2>
                <div className="input-group">
                  <textarea
                    placeholder="Ask your board members a question or present a decision..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                  />
                  <button onClick={askCouncil} disabled={loading}>
                    {loading ? 'Generating responses...' : 'Get Board Advice'}
                  </button>
                </div>

                {response && (
                  <div className="response-box">
                    <h3>Board Response:</h3>
                    <p>{response}</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <style jsx>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
              sans-serif;
            background: #f5f5f5;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #1a1a1a;
          }

          .subtitle {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 30px;
          }

          .section {
            background: white;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: #1a1a1a;
          }

          h3 {
            font-size: 1.2rem;
            margin-bottom: 8px;
          }

          h4 {
            margin-bottom: 4px;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          input,
          textarea {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            font-family: inherit;
          }

          input:focus,
          textarea:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          button {
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
          }

          button:hover:not(:disabled) {
            background: #1d4ed8;
          }

          button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }

          .delete-btn {
            background: #ef4444;
            padding: 8px 12px;
            font-size: 0.9rem;
          }

          .delete-btn:hover {
            background: #dc2626;
          }

          .councils-list,
          .members-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .council-card,
          .member-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .council-card:hover {
            border-color: #2563eb;
            background: #f0f9ff;
          }

          .council-card.active {
            border-color: #2563eb;
            background: #dbeafe;
          }

          .council-card h3,
          .member-card h4 {
            margin: 0;
          }

          .council-card p,
          .member-card p {
            color: #666;
            margin: 4px 0 0 0;
            font-size: 0.9rem;
          }

          .council-card small {
            display: block;
            color: #999;
            font-size: 0.85rem;
            margin-top: 4px;
          }

          .response-box {
            margin-top: 20px;
            padding: 16px;
            background: #f0f9ff;
            border-left: 4px solid #2563eb;
            border-radius: 6px;
          }

          .response-box h3 {
            margin-bottom: 12px;
            color: #1e40af;
          }

          .response-box p {
            color: #1a1a1a;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
          }

          @media (max-width: 640px) {
            h1 {
              font-size: 1.8rem;
            }

            .section {
              padding: 16px;
            }

            .council-card,
            .member-card {
              flex-direction: column;
              align-items: flex-start;
            }

            .delete-btn {
              align-self: flex-end;
              margin-top: 8px;
            }
          }
        `}</style>
      </main>
    </>
  )
}
