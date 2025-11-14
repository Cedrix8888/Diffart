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
    const chatEndRef = useRef(null);

    // AI回复模板
    const aiResponses = [
        "I can help you create various designs - websites, graphics, presentations and more. Could you specify your needs?",
        "Tell me more about your design project. What style, colors, or elements are you looking for?",
        "Would you like to start with a sketch, or do you have specific requirements for your design?",
        "I can generate design drafts based on your description. Please provide more details about your project.",
        "Your design request is noted. Let me work on some options for you. Would you need any adjustments in particular?"
    ];

    // 自动滚动到底部
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 处理发送消息
    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedMessage = userInput.trim();
        
        if (trimmedMessage) {
        // 添加用户消息
        setMessages([...messages, { sender: 'user', content: trimmedMessage }]);
        setUserInput('');

        // 模拟AI回复延迟
        setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            setMessages(prev => [...prev, { sender: 'ai', content: randomResponse }]);
        }, 800);
        }
    };

    // 处理键盘输入
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
        }
    };

    // 防止XSS攻击
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    return (
        <div className="card w-[30%] h-[90%] ml-10 flex flex-col justify-between items-center z-5">
            {/* 聊天记录区域 */}
            <div className="flex-1 overflow-y-auto space-y-4 z-5">
                {messages.map((message, index) => (
                    <div key={index} className="message-appear">
                        {message.sender === 'user' ? (
                            <div className="flex justify-end">
                                <div className="px-4 py-3 bg-[#2c2c2c] text-white rounded-lg max-w-[60%] font-inter font-medium text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
                                    <p>{escapeHtml(message.content)}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="px-4 py-3 text-white rounded-lg max-w-[60%] font-serif font-light text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
                                    <p>{escapeHtml(message.content)}</p>
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
                    <button className="h-8 min-w-8 rounded-full bg-[#2c2c2c] flex items-center justify-center enabled:hover:bg-[#4A535F] enabled:active:bg-[#191E26] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30" onClick={handleSendMessage}>
                        <img src="/arrow_upward.svg" alt="send" width='24' height='24'/>
                    </button>
                </div>
            </div>
        </div>
    );
}
