import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface BoardMember {
  id: string
  name: string
  description: string
}

interface RequestBody {
  question: string
  boardMembers: BoardMember[]
}

interface ResponseData {
  response?: string
  error?: string
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question, boardMembers } = req.body as RequestBody

    if (!question || !boardMembers || boardMembers.length === 0) {
      return res.status(400).json({ error: 'Question and board members are required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Create a prompt that asks each board member's perspective
    const membersList = boardMembers
      .map((member) => `- ${member.name} (${member.description})`)
      .join('\n')

    const prompt = `You are a board of directors with different perspectives. Each member will provide their worldview and expertise on the following question.

Board Members:
${membersList}

Question: ${question}

For each board member, provide their perspective and advice based on their worldview and expertise. Format the response clearly with each member's name and their advice.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    res.status(200).json({ response })
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    res.status(500).json({ error: 'Failed to generate response from board' })
  }
}
