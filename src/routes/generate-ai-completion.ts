import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from "zod";
import { openai } from "../lib/openai";
import {streamToResponse, OpenAIStream} from "ai"

export async function generateAICompletion(app: FastifyInstance ) {
   app.post("/ai/complete", async function (req, response) {

    const bodySchema = z.object({
        videoId: z.string().uuid(),
        template: z.string(),
        temperatura: z.number().min(0).max(1).default(0.5)
    })

    const {videoId, template, temperatura} = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
        where: {
            id: videoId
        }
    })

    if(!video.transcripton) {
        return response.status(400).send({error: "Ainda não foi gerado uma transcription para esse video"})
    }

    const promptMessage = template.replace('{transcription}', video.transcripton)

    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        temperature : temperatura,
        messages: [{
            role: "user", content: promptMessage
        }],
        stream: true
    })

    const stream = OpenAIStream(res)

    streamToResponse(stream, response.raw, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":  "GET, POST, PUT, DELETE, OPTIONS"
        }
    })
    
})
}