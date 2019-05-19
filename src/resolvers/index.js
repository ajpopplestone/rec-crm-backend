import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Candidate from './Candidate'
import Company from './Company'
import Booking from './Booking'


const resolvers = {
    Query,
    Mutation,
    // Subscription,
    User,
    Candidate,
    Company,
    Booking
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }