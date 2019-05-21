import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'
import moment from 'moment'

const Mutation = {
    async createUser(parent, args, { prisma }, info) { 
        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password
            } 
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        // console.log('hello')
        
        const user = await prisma.query.user({ 
            where: {
                email: args.data.email.toLowerCase()
            }
        })
        
        if (!user) {
            throw new Error('Unable to login')
        }
        
        // console.log(user.password)
        const isMatch = await bcrypt.compare(args.data.password, user.password)

        // console.log(isMatch)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        return prisma.mutation.deleteUser({ 
            where: {
                id: userId 
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }
        
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    async createCandidate(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        // console.log('creating candidate')
        // console.log(args)

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            },
            createdBy: {
                connect: {
                    id: userId
                }
            }
        }

        let consultantDetails = null
        if(args.data.consultant && args.data.consultant !== "Unspecified") {
            consultantDetails = {
                consultant: {
                    connect: {
                        id: args.data.consultant
                    }
                }
            }
        } else {
            args.data.consultant = null
        }

        const statusDetails = {
                status: {
                    connect: {
                        shortCode: args.data.status
                    }
                }
            }
        

        const roleDetails  = {
                role: {
                    connect: {
                        shortCode: args.data.role
                    }
                }
            }

        // console.log({...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...roleDetails})

        return prisma.mutation.createCandidate({
            data: {...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...roleDetails}
        }, info)
    },
    async updateCandidate(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const candidateExists = await prisma.exists.Candidate({
            id: args.id
        })

        // console.log(args)

        if(!candidateExists) {
            throw new Error('Unable to update candidate')
        }

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            }
        }
        
        let consultantDetails = null
        if(args.data.consultant && args.data.consultant !== "Unspecified") {
            consultantDetails = {
                consultant: {
                    connect: {
                        id: args.data.consultant
                    }
                }
            }
        } else {
            consultantDetails = {
                consultant: {
                    disconnect: true
                }
            }
        }

        const statusDetails = {
            status: {
                connect: {
                    shortCode: args.data.status
                }
            }
        }
    

        const roleDetails  = {
            role: {
                connect: {
                    shortCode: args.data.role
                }
            }
        }

        // console.log({...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...roleDetails})

        return prisma.mutation.updateCandidate({
            where: {
                id: args.id
            },
            data: {...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...roleDetails}
        }, info)
    },
    async deleteCandidate(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }


        const candidateExists = await prisma.exists.Candidate({
            id: args.id
        })

        if(!candidateExists) {
            throw new Error('Unable to delete candidate')
        }

        return prisma.mutation.deleteCandidate({
            where: {
                id: args.id
            }
        }, info)
    },
    async createCompany(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            },
            createdBy: {
                connect: {
                    id: userId
                }
            }
        }

        let consultantDetails = null
        if(args.data.consultant && args.data.consultant !== "Unspecified") {
            consultantDetails = {
                consultant: {
                    connect: {
                        id: args.data.consultant
                    }
                }
            }
        } else {
            args.data.consultant = null
        }

        const statusDetails = {
                status: {
                    connect: {
                        shortCode: args.data.status
                    }
                }
            }
        

        const busTypeDetails  = {
                businessType: {
                    connect: {
                        shortCode: args.data.businessType
                    }
                }
            }

        return prisma.mutation.createCompany({
            data: {...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...busTypeDetails}
        }, info)
    },
    async updateCompany(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const companyExists = await prisma.exists.Company({
            id: args.id
        })

        if(!companyExists) {
            throw new Error('Unable to update company')
        }

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            }
        }

        let consultantDetails = null
        if(args.data.consultant && args.data.consultant !== "Unspecified") {
            consultantDetails = {
                consultant: {
                    connect: {
                        id: args.data.consultant
                    }
                }
            }
        } else {
            consultantDetails = {
                consultant: {
                    disconnect: true
                }
            }
        }

        const statusDetails = {
            status: {
                connect: {
                    shortCode: args.data.status
                }
            }
        }
    

        const busTypeDetails  = {
            businessType: {
                connect: {
                    shortCode: args.data.businessType
                }
            }
        }

        return prisma.mutation.updateCompany({
            where: {
                id: args.id
            },
            data: {...args.data, ...userDetails, ...consultantDetails, ...statusDetails, ...busTypeDetails}
        }, info)
    },
    async deleteCompany(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }


        const companyExists = await prisma.exists.Company({
            id: args.id
        })

        if(!companyExists) {
            throw new Error('Unable to delete company')
        }

        return prisma.mutation.deleteCompany({
            where: {
                id: args.id
            }
        }, info)
    },
    async createBooking(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        // console.log('creating booking')
        console.log(args)

        // Check date does not have booking
        const bookingOnDay = await prisma.query.bookings({
            where: {
                AND: [
                    {
                        date: args.data.date
                    },
                    {
                        candidate: {
                            id: args.data.candidate
                        }
                    }
                ]
            }
        })

        console.log(bookingOnDay)

        if(bookingOnDay.length !== 0){
            throw new Error('Unable to make booking, day already booked')
        }

        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            },
            createdBy: {
                connect: {
                    id: userId
                }
            }
        }

        const roleDetails = {
            role: {
                connect: {
                    shortCode: args.data.role
                }
            }
        }
        
        const company = {
            company: {
                connect: {
                    id: args.data.company
                }
            }
        }

        const candidate = {
            candidate: {
                connect: {
                    id: args.data.candidate
                }
            }
        }

        // console.log({...args.data, ...userDetails, ...company, ...candidate, ...roleDetails})

        return prisma.mutation.createBooking({
            data: {...args.data, ...userDetails, ...company, ...candidate, ...roleDetails}
        }, info)
    },
    async updateBooking(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const bookingExists = await prisma.exists.Booking({
            id: args.id,
        })

        console.log(args)

        if(!bookingExists) {
            throw new Error('Unable to update Booking')
        }

        // Check date does not have booking
        const bookingOnDay = await prisma.query.bookings({
            where: {
                AND: [
                    {
                        date: args.data.date
                    },
                    {
                        candidate: {
                            id: args.data.candidate
                        }
                    }
                ]
            }
        })

        console.log(bookingOnDay)

        if(bookingOnDay.length !== 0){
            console.log(bookingOnDay[0].id)
            console.log(args.id)
            if(bookingOnDay[0].id !== args.id){
                throw new Error('Unable to make booking, day already booked')
            }
        }


        const userDetails = {
            updatedBy: {
                connect: {
                    id: userId
                }
            }
        }

        const company = {
            company: {
                connect: {
                    id: args.data.company
                }
            }
        }

        const candidate = {
            candidate: {
                connect: {
                    id: args.data.candidate
                }
            }
        }

        const roleDetails  = {
            role: {
                connect: {
                    shortCode: args.data.role
                }
            }
        }

        return prisma.mutation.updateBooking({
            where: {
                id: args.id
            },
            data: {...args.data, ...userDetails, ...roleDetails, ...company, ...candidate}
        }, info)
    },
    async deleteBooking(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }


        const bookingExists = await prisma.exists.Booking({
            id: args.id
        })

        if(!bookingExists) {
            throw new Error('Unable to delete Booking')
        }

        return prisma.mutation.deleteBooking({
            where: {
                id: args.id
            }
        }, info)
    },
    async createCandStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        return prisma.mutation.createCandStatus({
            data: {...args.data}
        }, info)
    }, 
    async updateCandStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        const codeExists = await prisma.exists.CandStatus({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to update Code')
        }

        return prisma.mutation.updateCandStatus({
            where: {
                id: args.id,
            },
            data: {...args.data}
        }, info)
    }, 
    async deleteCandStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }

        const codeExists = await prisma.exists.CandStatus({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to delete Code')
        }

        return prisma.mutation.deleteCandStatus({
            where: {
                id: args.id,
            }
        }, info)
    },
    async createCandRole(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        return prisma.mutation.createCandRole({
            data: {...args.data}
        }, info)
    }, 
    async updateCandRole(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        const codeExists = await prisma.exists.CandRole({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to update Code')
        }

        return prisma.mutation.updateCandRole({
            where: {
                id: args.id,
            },
            data: {...args.data}
        }, info)
    }, 
    async deleteCandRole(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }

        const codeExists = await prisma.exists.CandRole({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to delete Code')
        }

        return prisma.mutation.deleteCandRole({
            where: {
                id: args.id,
            }
        }, info)
    }, 
    async createCompStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        return prisma.mutation.createCompStatus({
            data: {...args.data}
        }, info)
    }, 
    async updateCompStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        const codeExists = await prisma.exists.CompStatus({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to update Code')
        }

        return prisma.mutation.updateCompStatus({
            where: {
                id: args.id,
            },
            data: {...args.data}
        }, info)
    }, 
    async deleteCompStatus(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }

        const codeExists = await prisma.exists.CompStatus({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to delete Code')
        }

        return prisma.mutation.deleteCompStatus({
            where: {
                id: args.id,
            }
        }, info)
    }, 
    async createBusType(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        return prisma.mutation.createBusType({
            data: {...args.data}
        }, info)
    }, 
    async updateBusType(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        const codeExists = await prisma.exists.BusType({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to update Code')
        }

        return prisma.mutation.updateBusType({
            where: {
                id: args.id,
            },
            data: {...args.data}
        }, info)
    }, 
    async deleteBusType(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })

        if(!user.officeManager) {
            throw new Error('Insufficient permissions')
        }

        if(!user.delPermission) {
            throw new Error('Insufficient permissions to delete')
        }

        const codeExists = await prisma.exists.BusType({
            id: args.id
        })

        if(!codeExists) {
            throw new Error('Unable to delete Code')
        }

        return prisma.mutation.deleteBusType({
            where: {
                id: args.id,
            }
        }, info)
    }
}

export default Mutation