import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const resolvers = {
    Query: {
        users: async (parent: any, arg: any, context: any) => {
            return await prisma.user.findMany()
        },
        user: async (parent: any, arg: { userId: any; }, context: any) => {
            const { userId } = arg;

            return await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
        }
    },
    Mutation: {
        signup: async (parent: unknown, arg: { name: string; email: string; password: string; }, content: any) => {
            const { name, email, password } = arg

            const existingUser = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (existingUser) {
                return {
                    user: null,
                    token: null,
                    meassage: "This email is already use"
                }
            }

            const hashPassword = bcrypt.hashSync(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    posts: true,
                    profile: true,
                    createdAt: true,
                    updatedAt: true
                }
            })

            const tokenPayload = {
                id: user.id,
                email: user.email
            }

            const token = jwt.sign(tokenPayload, 'mehedihasannabil', { expiresIn: "1d" });

            return {
                user,
                token,
                message: "Signup is done"
            }
        },
        login: async (parent: unknown, arg: { name: string; email: any; password: string; }, context: unknown) => {
            const { email, password } = arg

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!user) {
                return {
                    user: null,
                    token: null,
                    message: "User is not found"
                }
            }

            const isMatched = bcrypt.compareSync(password, user.password);

            if (!isMatched) {
                return {
                    user: null,
                    token: null,
                    message: "Password is not match"
                }
            }

            const tokenPayload = {
                id: user.id,
                email: user.email
            }

            const token = jwt.sign(tokenPayload, 'mehedihasannabil', { expiresIn: "1d" });

            return {
                user,
                token,
                message: "Login successfully"
            }
        }
    }
};