import { fastify } from "fastify";
import {fastifyCors} from "@fastify/cors"
import { getAllPromptsRoutes } from "./routes/get-all-prompts";
import { uploadVideo } from "./routes/upload-video";
import { createTranscription } from "./routes/create-transcription";
import { generateAICompletion } from "./routes/generate-ai-completion";

const app = fastify();

app.register(fastifyCors, {
    origin: "*"
})

app.register(getAllPromptsRoutes)

app.register(uploadVideo)

app.register(createTranscription)

app.register(generateAICompletion)

app.listen({
    port: 3333
}).then(function () {
    console.log("HTTP server Running!");

})


