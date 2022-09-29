import type {PageServerLoad} from './$types'

// Importing the generated client from our custom location specified in prisma/schema.prisma
// Changing the generator to the default location and importing '@prisma/client' instead sidesteps the bug.
import {PrismaClient} from 'custom-client-location'

const prisma = new PrismaClient()

try {
  const users = await prisma.user.findMany()
  console.log(users)
} catch (e) {
  console.error(e)
}

export const load: PageServerLoad = async () => {
  const users = await prisma.user.findMany()
  console.log(users)
}
