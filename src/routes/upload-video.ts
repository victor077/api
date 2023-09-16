import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import {randomUUID} from "crypto";


// Aqui iniciamos o metodo para baixar arquivos mp3, lembrando que fazer o uploado de video
// para mp3 será no browser

export async function uploadVideo(app: FastifyInstance ) {
    // fastifyMultipart é uma lib que trabalha diretamente com upload de arquivos
    // utilizo algumas opções para controlar o tamanho dos arquivos que serão baixados
    // fonte: https://github.com/fastify/fastify-multipart
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1048576 * 25, //25mega
        }
    })


   app.post("/videos", async function (request, reply) {
    const data = await request.file()

    if(!data) {
        return reply.status(400).send({error: "falta arquivo de input."})
    }

    // path um modulo interno do node aonde chamamos a função extname que retorna  a extensão do arquivo
    // somente o nome do arquivo
    // alguns modulos internos do node: path, fs, crypto, htpp, util, stream

    // aqui pegamos somente a extensão do arquivo
    const extension = path.extname(data.filename)

    if(extension != ".mp3"){
        return reply.status(400).send({error: "tipo de arquivo invalido, porfavor uploado mp3."})
    }

    //base name uma function do node que retorna o nome do arquivo apenas sem sua extensão
    const fileBaseName = path.basename(data.filename, extension)

    //randomUUID gera um id aleatorio como no sq
    const fileUploadName = `${fileBaseName}-${randomUUID()}-${extension}`

    const uploadPath = path.resolve(__dirname, "../../tmp",fileUploadName)
})
}