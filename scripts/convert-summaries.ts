import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { paragraphsToLexical, textToLexical } from '../src/lib/lexical'

// One-off: wrap legacy plain-string richText values (from the old textarea
// fields) into Lexical editor state so the admin editor can open them.
// Covers experience.summary and posts.body. Safe to rerun — converted rows are skipped.
async function run() {
  const payload = await getPayload({ config })
  let converted = 0

  const experience = await payload.find({ collection: 'experience', limit: 100 })
  for (const doc of experience.docs) {
    const summary = doc.summary as unknown
    if (typeof summary !== 'string') continue // already Lexical JSON

    await payload.update({
      collection: 'experience',
      id: doc.id,
      data: { summary: textToLexical(summary) },
    })
    converted++
    console.log(`✓ experience: ${doc.role} @ ${doc.company}`)
  }

  const posts = await payload.find({ collection: 'posts', limit: 100, draft: true })
  for (const doc of posts.docs) {
    const body = doc.body as unknown
    if (typeof body !== 'string') continue

    await payload.update({
      collection: 'posts',
      id: doc.id,
      data: { body: paragraphsToLexical(body) },
    })
    converted++
    console.log(`✓ post: ${doc.title}`)
  }

  console.log(`Done. Converted ${converted} entries.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
