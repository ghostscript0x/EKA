import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'me@example.com' },
    update: {},
    create: {
      email: 'me@example.com',
      password,
      name: 'Admin',
    },
  })

  const defaultSections = [
    { id: 'sec_1', key: 'pray', title: 'Pray', emoji: '🙏', order: 1 },
    { id: 'sec_2', key: 'build', title: 'Build', emoji: '🔨', order: 2 },
    { id: 'sec_3', key: 'automate', title: 'Automate', emoji: '🤖', order: 3 },
    { id: 'sec_4', key: 'learn', title: 'Learn', emoji: '📚', order: 4 },
    { id: 'sec_5', key: 'document', title: 'Document', emoji: '📝', order: 5 },
    { id: 'sec_6', key: 'connect', title: 'Connect', emoji: '🤝', order: 6 },
    { id: 'sec_7', key: 'opportunities', title: 'Opportunities', emoji: '🎯', order: 7 },
    { id: 'sec_8', key: 'clean', title: 'Clean', emoji: '🧹', order: 8 },
    { id: 'sec_9', key: 'review', title: 'Review', emoji: '✅', order: 9 },
  ]

  for (const sec of defaultSections) {
    await prisma.section.upsert({
      where: { key: sec.key },
      update: {},
      create: sec,
    })
  }

  // Check if template items exist for this user
  const count = await prisma.templateItem.count({ where: { userId: user.id } })
  if (count === 0) {
    const defaultTemplates = [
      { sectionId: 'sec_1', label: 'Pray, Prepare your mind for the day', order: 1 },
      
      { sectionId: 'sec_2', label: 'Current project', order: 1 },
      { sectionId: 'sec_2', label: 'SaaS idea', order: 2 },
      { sectionId: 'sec_2', label: 'Backend', order: 3 },
      { sectionId: 'sec_2', label: 'Frontend', order: 4 },
      { sectionId: 'sec_2', label: 'API', order: 5 },
      { sectionId: 'sec_2', label: 'Database', order: 6 },
      { sectionId: 'sec_2', label: 'New feature', order: 7 },
      { sectionId: 'sec_2', label: 'Fix a difficult bug', order: 8 },
      { sectionId: 'sec_2', label: 'Improve an existing project', order: 9 },
      
      { sectionId: 'sec_3', label: 'Build an automation', order: 1 },
      { sectionId: 'sec_3', label: 'Experiment with an AI API', order: 2 },
      { sectionId: 'sec_3', label: 'Build an agent', order: 3 },
      { sectionId: 'sec_3', label: 'Connect APIs', order: 4 },
      { sectionId: 'sec_3', label: 'Automate a boring workflow', order: 5 },
      { sectionId: 'sec_3', label: 'Add AI to your software', order: 6 },
      
      { sectionId: 'sec_4', label: 'Cybersecurity', order: 1 },
      { sectionId: 'sec_4', label: 'Networking', order: 2 },
      { sectionId: 'sec_4', label: 'Linux', order: 3 },
      { sectionId: 'sec_4', label: 'Python', order: 4 },
      { sectionId: 'sec_4', label: 'Software Engineering', order: 5 },
      { sectionId: 'sec_4', label: 'AI', order: 6 },
      { sectionId: 'sec_4', label: 'Cloud', order: 7 },
      { sectionId: 'sec_4', label: 'Databases', order: 8 },
      { sectionId: 'sec_4', label: 'System Design', order: 9 },
      { sectionId: 'sec_4', label: 'Business', order: 10 },
      
      { sectionId: 'sec_5', label: 'Record your screen', order: 1 },
      { sectionId: 'sec_5', label: 'Explain what you built', order: 2 },
      { sectionId: 'sec_5', label: 'Show a before/after', order: 3 },
      { sectionId: 'sec_5', label: 'Share something you learned', order: 4 },
      { sectionId: 'sec_5', label: 'Post a build log', order: 5 },
      
      { sectionId: 'sec_6', label: 'Reply to interesting posts', order: 1 },
      { sectionId: 'sec_6', label: 'Share useful things', order: 2 },
      { sectionId: 'sec_6', label: 'Follow builders', order: 3 },
      { sectionId: 'sec_6', label: 'Participate in conversations', order: 4 },
      
      { sectionId: 'sec_7', label: 'Look for potential clients', order: 1 },
      { sectionId: 'sec_7', label: 'Send outreach', order: 2 },
      { sectionId: 'sec_7', label: 'Follow up', order: 3 },
      { sectionId: 'sec_7', label: 'Build relationships', order: 4 },
      
      { sectionId: 'sec_8', label: 'Commit your code', order: 1 },
      { sectionId: 'sec_8', label: 'Organize your project', order: 2 },
      { sectionId: 'sec_8', label: 'Update task list', order: 3 },
      { sectionId: 'sec_8', label: 'Save useful notes', order: 4 },
      { sectionId: 'sec_8', label: 'Know what you\'re continuing tomorrow', order: 5 },
      
      { sectionId: 'sec_9', label: 'Did I do the above today?', order: 1 },
    ]

    await prisma.templateItem.createMany({
      data: defaultTemplates.map(t => ({ ...t, userId: user.id }))
    })
  }

  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
