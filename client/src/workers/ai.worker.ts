import { pipeline, env } from '@xenova/transformers';

// Skip local checks for faster loading in some envs
env.allowLocalModels = false;
env.useBrowserCache = true;

class AIWorker {
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            // Using LaMini-Flan-T5-248M - compact & good for instructions
            this.instance = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M', { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event: MessageEvent) => {
    const { text } = event.data;

    try {
        const generator = await AIWorker.getInstance((data: any) => {
            self.postMessage(data);
        });

        const output = await generator(text, {
            max_new_tokens: 512,
            temperature: 0.7,
            repetition_penalty: 1.2,
        });

        self.postMessage({
            status: 'complete',
            output: output[0].generated_text,
        });

    } catch (error) {
        console.error('AI Processing Error:', error);
        self.postMessage({ status: 'error', error: error });
    }
});
