import { useState, useRef, useEffect } from 'react';
import './Chatbox.css';


export default function Chatbox() {
    // 状态管理
    const [messages, setMessages] = useState([
        {
        sender: 'ai',
        content: 'Hi! I am your AI design agent. How can I help you with your design project today?'
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef(null);


    // 自动滚动到底部
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 处理发送消息
    const handleSendMessage = async (e) => {
        let endpoint = '';
        let submitData;

        e.preventDefault();
        const trimmedMessage = userInput.trim();
        
        if (trimmedMessage && !isSending) {
            setIsSending(true);
            
            // 添加用户消息
            setMessages([...messages, { sender: 'user', content: trimmedMessage }]);
            submitData = {
                prompt: trimmedMessage,
            }
            setUserInput('');

            try {
                // 添加AI回复
                endpoint = '/api/llm/chat';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': "u#Tqw(]%CTO+u&[FQ&G6apADEmKzOqc[Aqk-6W~Z"
                    },
                    body: JSON.stringify(submitData)
                });

                if (response.ok) {
                    const result = await response.json();
                    setMessages(prev => [...prev, { sender: 'ai', content: result.content }]);
                    console.log('提交成功', result);
                }
            } finally {
                setIsSending(false);
            }
        }
    };

    // 处理键盘输入
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
        }
    };



    return (
        <div className="card w-[30%] h-[90%] ml-10 flex flex-col justify-between items-center z-5">
            {/* 聊天记录区域 */}
            <div className="flex-1 overflow-y-auto space-y-4 z-5">
                {messages.map((message, index) => (
                    <div key={index} className="message-appear">
                        {message.sender === 'user' ? (
                            <div className="flex justify-end">
                                <div className="px-4 py-3 mr-3 bg-[#2c2c2c] text-white rounded-lg max-w-[60%] font-inter font-medium text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="px-4 py-3 text-white rounded-lg max-w-[60%] font-serif font-light text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="relative min-h-[120px] w-full rounded-xl border-[2px] border-[#2c2c2c] p-2 flex flex-col justify-between gap-2 text-sm z-5">
                <textarea
                    id='chatbox-input'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Start with an idea, or type "@" to mention'
                    className="z-5 relative max-h-60 min-h-12 w-full cursor-text px-1 outline-none resize-none bg-transparent text-white text-sm leading-[1.8]"
                    spellCheck="true"
                />
                <div className="z-1 flex w-full items-center justify-end text-xs">
                    <button
                        id='chat-send'
                        className={`h-8 min-w-8 rounded-full bg-[#4e4e4e] flex items-center justify-center relative overflow-hidden transition-all duration-200 ease-in-out enabled:hover:bg-[#3c3c3c] enabled:cursor-pointer disabled:cursor-not-allowed ${isSending ? 'sending' : ''}`}
                        onClick={handleSendMessage}
                        disabled={isSending || !userInput.trim()}
                    >
                        <img src="/arrow_upward.svg" alt="send" width='24' height='24' className='transition-all duration-300 ease-in-out'/>
                    </button>
                </div>
            </div>
        </div>
    );
}
