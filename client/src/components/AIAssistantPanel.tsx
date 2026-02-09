import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Copy, ArrowRight, X, Loader2, Sparkles } from 'lucide-react';

interface AIAssistantPanelProps {
    onInsert: (text: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ onInsert, isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            // Create a web worker for the AI model to avoid blocking UI
            worker.current = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
                type: 'module'
            });

            worker.current.onmessage = (event: MessageEvent) => {
                const { status, output, file, progress } = event.data;

                if (status === 'initiate') {
                    setModelLoading(true);
                } else if (status === 'progress') {
                    setProgress(progress);
                } else if (status === 'done') {
                    setModelLoading(false);
                } else if (status === 'complete') {
                    setOutput(output);
                    setLoading(false);
                }
            };
        }

        return () => {
            // worker.current?.terminate(); // Keep worker alive for caching
        };
    }, []);

    const handleGenerate = () => {
        if (!input.trim() || loading) return;
        setLoading(true);
        setOutput('');
        worker.current?.postMessage({ text: input });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col border-l">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                    <Sparkles size={20} />
                    <h2 className="font-semibold">AI Assistant</h2>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    <p><strong>Tip:</strong> Create professional drafts instantly. Try:</p>
                    <ul className="list-disc ml-4 mt-1 space-y-1">
                        <li>"Write a leave application for 2 days"</li>
                        <li>"Draft a complaint about street lights"</li>
                        <li>"Request for quotation for laptops"</li>
                    </ul>
                </div>

                {modelLoading && (
                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
                        <div className="flex items-center mb-2">
                            <Loader2 className="animate-spin mr-2" size={16} />
                            <span>Loading AI Model (First Run Only)...</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {output && (
                    <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {output}
                        </div>
                        <div className="flex space-x-2 pt-2 border-t">
                            <button
                                onClick={() => { navigator.clipboard.writeText(output); }}
                                className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs bg-white border rounded hover:bg-gray-50"
                            >
                                <Copy size={14} className="mr-1" /> Copy
                            </button>
                            <button
                                onClick={() => onInsert(output)}
                                className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                <ArrowRight size={14} className="mr-1" /> Insert
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-gray-50">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe what you want to write..."
                        className="w-full pl-3 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none h-24"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleGenerate();
                            }
                        }}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !input.trim()}
                        className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                    AI content is generated locally. Verify before use.
                </p>
            </div>
        </div>
    );
};

export default AIAssistantPanel;
