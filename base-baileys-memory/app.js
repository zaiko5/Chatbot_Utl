import botWhatsapp from '@bot-whatsapp/bot';
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = botWhatsapp;

import QRPortalWeb from '@bot-whatsapp/portal';
import BaileysProvider from '@bot-whatsapp/provider/baileys';
import MockAdapter from '@bot-whatsapp/database/mock';
import dotenv from 'dotenv';
dotenv.config();

import { responderGemini } from './gemini.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const usuariosSaludados = new Set();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prompt = path.join(__dirname, 'prompt.txt');
const promptL = fs.readFileSync(prompt, 'utf8');


const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer(
        '¡Hola! 👋 Soy tu guía de admisiones de la *Universidad Tecnológica de León*.\n\n¿Tienes dudas sobre cómo inscribirte, qué carrera elegir, o qué fechas tener en cuenta?\n\nEscribime tu pregunta y te oriento paso a paso.',
        { capture: true },
        async (ctx, { gotoFlow }) => {
            return gotoFlow(flowConsulta);
        }
    );

// Flujo de consultas que usa Gemini
const flowConsulta = addKeyword(EVENTS.ACTION)
    .addAnswer({ capture: true })
    .addAction(async (ctx, { flowDynamic, gotoFlow }) => {
        const consulta = ctx.body;
        const answer = await responderGemini(promptL, consulta);
        await flowDynamic(answer); // Mostramos la respuesta
        console.log(answer)
        return gotoFlow(flowSegundaConsulta)
    });

const flowSegundaConsulta = addKeyword(EVENTS.ACTION)
    .addAnswer("Tienes alguna otra consulta sobre la utl?", { capture: true })
    .addAction(async (ctx, { flowDynamic, gotoFlow }) => {
        const consulta = ctx.body;
        const answer = await responderGemini(promptL, consulta);
        await flowDynamic(answer); // Mostramos la respuesta
        console.log(answer)
        return gotoFlow(flowSegundaConsulta)
    });

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowConsulta, flowSegundaConsulta]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
