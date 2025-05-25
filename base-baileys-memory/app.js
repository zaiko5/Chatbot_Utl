const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const chat = require("./chatGPT")
require("dotenv").config();
//Set para los usuarios ya saludados (no se puede repetir)
const usuariosSaludados = new Set();

//Evento de bienvenida (mensaje principal).
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { gotoFlow, endFlow }) => {
        if (usuariosSaludados.has(ctx.from)) return endFlow(); // ya fue saludado
        usuariosSaludados.add(ctx.from);

        return gotoFlow(flowBienvenida);
    });

const flowBienvenida = addKeyword([])
    .addAnswer('¡Hola! 👋 Soy tu guía de admisiones de la *Universidad Tecnológica de León*.\n\n¿Tienes dudas sobre cómo inscribirte, qué carrera elegir, o qué fechas tener en cuenta?\n\nEscribime tu pregunta y te oriento paso a paso.')
    .addAction(async (_, { gotoFlow }) => {
        return gotoFlow(flowConsultaAPI)
    });

const flowConsultaAPI = addKeyword([/.*/])
.addAction({ capture:true }, async(ctx, { flowDynamic }) => {
    const prompt = "A lo que sea responde hola";
    const consulta = ctx.body
    const answer = await chat (prompt, consulta)
    await flowDynamic(answer.content)
})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowConsultaAPI])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
