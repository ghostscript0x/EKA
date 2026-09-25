import prisma from './db'
import { format, subDays } from 'date-fns'

export async function calculateStreak(userId: string) {
  const days = await prisma.dayRecord.findMany({
    where: { userId },
    include: {
      checkedItems: true,
      extraTasks: true,
    },
    orderBy: { date: 'desc' }
  })

  const templates = await prisma.templateItem.findMany({
    where: { userId, active: true }
  })

  const sections = await prisma.section.findMany()
  const sectionIds = sections.map(s => s.id)

  let currentStreak = 0
  let longestStreak = 0
  let currentTemp = 0
  
  const today = format(new Date(), 'yyyy-MM-dd')
  let checkDate = new Date()
  let foundStart = false

  for (let i = 0; i < 1000; i++) {
    const dStr = format(checkDate, 'yyyy-MM-dd')
    const record = days.find(d => d.date === dStr)
    
    let isComplete = false
    
    if (record) {
      const completedSections = new Set<string>()
      
      record.checkedItems.forEach(ci => {
        const template = templates.find(t => t.id === ci.templateItemId)
        if (template) completedSections.add(template.sectionId)
      })
      
      record.extraTasks.forEach(et => {
        if (et.checked) completedSections.add(et.sectionId)
      })
      
      isComplete = sectionIds.every(sId => completedSections.has(sId))
    }

    if (isComplete) {
      currentTemp++
      if (currentTemp > longestStreak) longestStreak = currentTemp
      if (!foundStart || (foundStart && currentStreak > 0)) {
         currentStreak = currentTemp
         foundStart = true
      }
    } else {
      if (dStr !== today) {
        // If it's a rest day, we just don't reset the currentTemp. The streak is frozen.
        if (!record?.isRestDay) {
          if (!foundStart) foundStart = true
          currentTemp = 0
        }
      }
    }
    
    checkDate = subDays(checkDate, 1)
  }

  return { current: currentStreak, longest: longestStreak }
}
