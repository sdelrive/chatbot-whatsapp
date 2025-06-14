import OpenAI from "openai";

export class OpenAIClient {

    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
    }

    async getJoke() {
        const response = await this.client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Decime un chiste corto" }],
        });
        return response;
    }

    async sendMessage( body ) {
        console.log("Sending message to OpenAI:", body);
        const response = await this.client.chat.completions.create(body);

        const responseMessage = response.choices[0].message;
        return (responseMessage.content ?? "").trim();
    }
}
