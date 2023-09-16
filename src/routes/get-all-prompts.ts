import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function getAllPromptsRoutes(app: FastifyInstance ) {
   app.get("/prompts", async function () {
    return await prisma.prompt.findMany()
})
}