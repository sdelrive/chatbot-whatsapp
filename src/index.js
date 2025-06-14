import 'dotenv/config';
import express from 'express';

import { ChatBotService } from './chatBotService.js';
import { connectRedis, redisClient } from './config/redis_connection.js';
import { RedisHistory } from './redis_history.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const router = express.Router();



// post message to openai and get response
router.post('/chat', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY no está definido en las variables de entorno.' });
    }
    const chatbotService = new ChatBotService(apiKey);

    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'El mensaje es requerido.' });
        }
        const respuesta = await chatbotService.sendMessage(message);
        res.json({ respuesta });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando el mensaje que deseo enviar' });
    }
});


//  endpoint to send and recieve whatsapp using Twilio
router.post('/send-sms', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY no está definido en las variables de entorno.' });
    }

    const chatbotService = new ChatBotService(apiKey);
    const from = req.body.From;
    const message = req.body.Body;

    if (!from || !message) {
        return res.status(400).json({ error: 'El número de origen y el mensaje son requeridos.' });
    }


    // Aqui obtengo el historial de mensajes del usuario desde Redis
    const history = new RedisHistory();
    const mensajes = await history.getUserSession( from);
    console.log('Historial de mensajes:', mensajes);
    mensajes.push({ role: 'user', content: message });

    // Aquí proceso el mensaje recibido antes de enviarlo a Twilio

    console.log('Mensaje recibido:', message);
    console.log('Mensajes antes de enviar a OpenAI:', mensajes);
     let responseFromOpenAi =  await chatbotService.sendMessage(mensajes)


   
    try {

        // este mensaje tiene que ser pasado por openai
        const sid = await chatbotService.twilioPostMessage(responseFromOpenAi);
        
          // Aquí obtengo la respuesta de OpenAI y la agrego al historial
        mensajes.push({ role: 'assistant', content: sid });
        await history.saveUserSession(from, mensajes);

        return res.status(200).json({ message: 'Mensaje enviado a través de Twilio', sid });
    } catch (error) {
        return res.status(500).json({ error: `Error enviando mensaje por Twilio: ${error.message || error}` });
    }
});

app.use('/api/v1', router);

app.listen(3000, () => console.log('Servidor Express escuchando en puerto 3000'));
