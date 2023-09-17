import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from "zod";
import {createReadStream} from "node:fs"
import { openai } from "../lib/openai";

export async function createTranscription(app: FastifyInstance ) {
   app.post("/videos/:videoId/transcription", async function (req) {

    const paramsSchema = z.object({
        videoId: z.string().uuid()
    })
    // a função parse é usada para validar se o meu schema está seguindo a estrutura correta do videoId
    const {videoId} = paramsSchema.parse(req.params)


    const bodySchema = z.object({
        prompt: z.string()
    })

    const {prompt} = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
        where: {
            id: videoId
        }
    })


    const videoPath = video.path
    //createReadStream é uma função do node para ler arquivos de videos passando o caminho em que ele se encontra
    // obs: o node tem como funcionalidade para esses tipo de arquivos executar esses arquivos aos poucos para que seu app não trave 
    // algo proximo ao async await 
    const audioReadStream = createReadStream(videoPath)

    // aqui passamos o corpo para openai fazer a criação dessa transcrição do video
    // file: o arquivo que queremos fazer a transcrição
    // temperatura: modo de criatividade com sua assertividade, temperatura mais alta mais criatividade menos assertividade
    // prompt: ajuda a api encontra algumas palavras em que foi dito no seu video
    const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: "whisper-1",
        language: "pt",
        response_format: "json",
        temperature: 0,
        prompt
    })
    const transcripton = response.text

    await prisma.video.update({
        where: {
            id: videoId,
        }, 
        data: {
            transcripton
        }
    })
    return {transcripton}
})
}