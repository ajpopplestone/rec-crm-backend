import getUserId from "../utils/getUserId";
import { titleCase } from '../utils/functions'

const Query = {
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    users(parent, args, { prisma }, info) {
        console.log('fetching users')
        
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if(args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    candidates(parent, args, { prisma, request }, info) {
        // console.log(request.request.headers.authorization)
        getUserId(request)

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if(args.query) {
            opArgs.where = {
                OR: [
                    {forename_contains: args.query}, 
                    {forename_contains: args.query.toLowerCase()}, 
                    {forename_contains: args.query.toUpperCase()}, 
                    {forename_contains: titleCase(args.query)}, 
                    {surname_contains: args.query},
                    {surname_contains: args.query.toLowerCase()},
                    {surname_contains: args.query.toUpperCase()},
                    {surname_contains: titleCase(args.query)}
                ]
            }
        }
        
        return prisma.query.candidates(opArgs, info)
    },
    async candidate(parent, args, { prisma, request }, info) {
        getUserId(request)

        
        // const candExists = await prisma.exists.candidate({
        //     id: args.id
        // })

        // console.log(candExists)

        const candidates = await prisma.query.candidates({
            where: {
                id: args.id
            }
        }, info)

        if (candidates.length === 0) {
            throw new Error('Candidate not found')
        }

        return candidates[0]
    },
    companies(parent, args, { prisma, request }, info) {
        getUserId(request)
        console.log('query companies')
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if(args.query) {
            opArgs.where = {
                OR: [
                    {name_contains: args.query}, 
                    {name_contains: args.query.toLowerCase()}, 
                    {name_contains: args.query.toUpperCase()}, 
                    {name_contains: titleCase(args.query)} 
                ]
            }
        }

        return prisma.query.companies(opArgs, info)
    },
    async company(parent, args, { prisma, request }, info) {
        getUserId(request)

        const companies = await prisma.query.companies({
            where: {
                id: args.id
            }
        }, info)

        if (companies.length === 0) {
            throw new Error('Company not found')
        }

        return companies[0]
    },
    bookings(parent, args, { prisma, request }, info) {
        getUserId(request)

        console.log('fetching bookings')

        const opArgs = {
            orderBy: args.orderBy
        }

        if(args.candId) {
            opArgs.where = {
                candidate: {
                    id: args.candId
                }
            }
        }

        if(args.compId) {
            opArgs.where = {
                company: {
                    id: args.compId
                }
            }
        }

        return prisma.query.bookings(opArgs, info)
    },
    async booking(parent, args, { prisma, request }, info) {
        getUserId(request)
        const bookings = await prisma.query.bookings({
            where: {
                id: args.id
            }
        }, info)

        if (bookings.length === 0) {
            throw new Error('Booking not found')
        }

        return bookings[0]
    },
    candStatuses(parent, args, { prisma, request }, info) {
        return prisma.query.candStatuses(null, info)
    },
    candRoles(parent, args, { prisma, request }, info) {
        return prisma.query.candRoles(null, info)
    },
    compStatuses(parent, args, { prisma, request }, info) {
        return prisma.query.compStatuses(null, info)
    },
    busTypes(parent, args, { prisma, request }, info) {
        return prisma.query.busTypes(null, info)
    }
}

export default Query