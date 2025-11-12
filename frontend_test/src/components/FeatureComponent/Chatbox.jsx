import { useState, useRef, useEffect } from 'react';
import './Chatbox.css';

export default function Chatbox() {
    // 状态管理
    const [messages, setMessages] = useState([
        {
        sender: 'ai',
        content: 'Hi! I\'m your AI design agent. How can I help you with your design project today?'
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
        <div className="card w-[25%] h-[90%] ml-10 flex flex-col justify-between items-center z-5">
            {/* 聊天记录区域 */}
            <div className="flex-1 overflow-y-auto space-y-4 z-5">
                {messages.map((message, index) => (
                    <div key={index} className="message-appear">
                        {message.sender === 'user' ? (
                            <div className="flex justify-end">
                                <div className="px-4 py-3 bg-[#2c2c2c] text-white rounded-lg max-w-[80%] font-inter font-medium text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
                                    <p>{escapeHtml(message.content)}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="px-4 py-3 text-white rounded-lg max-w-[80%] font-inter font-medium text-[14px] leading-[160%] cursor-text select-text whitespace-pre-wrap break-words">
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
                    <button className="h-8 min-w-8 rounded-full bg-[#2F3640] flex items-center justify-center enabled:hover:bg-[#4A535F] enabled:active:bg-[#191E26] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30" data-testid="agent-send-button" data-state="closed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="h-[16px] w-[16px] [&amp;_path]:fill-white">
                            <path fill="#000" d="M17.576 3.999A2.424 2.424 0 0 1 20 6.423v11.152A2.424 2.424 0 0 1 17.576 20H6.424A2.424 2.424 0 0 1 4 17.575V6.423a2.424 2.424 0 0 1 2.424-2.424z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}











<div class="z-[1] flex w-full items-end justify-between text-xs">
    <div id="agent-chat-footer-menus" class="flex h-8 items-center gap-[2px]">
        <span type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-_r_10_" data-state="closed" class="lovart-menu-popover">
            <span>
                <button class="flex items-center justify-center gap-1 box-border rounded-full border-[0.5px] border-[#C4C4C4] bg-[transparent] text-[#363636] hover:bg-[#0C0C0D0A] active:bg-[#0C0C0D14] cursor-pointer h-8 px-2 transition-[border-color,background-color] duration-100 ease-in-out" data-testid="agent-attachment-button" style="width: 32px; height: 32px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[currentColor]">
                        <path fill="#000" d="M16 1.1A4.9 4.9 0 0 1 20.9 6a4.9 4.9 0 0 1-1.429 3.457h.001l-8.414 8.587-.007.006a2.9 2.9 0 0 1-3.887.193l-.213-.192a2.9 2.9 0 0 1-.007-4.095l8.414-8.586a.9.9 0 0 1 1.286 1.26L8.23 15.216l-.007.006a1.1 1.1 0 0 0 1.556 1.555l8.407-8.579.007-.007a3.1 3.1 0 0 0 .105-4.271l-.105-.112a3.1 3.1 0 0 0-4.384 0L5.4 12.387l-.007.006a5.1 5.1 0 0 0 7.214 7.213l7.749-7.934a.9.9 0 0 1 1.288 1.256l-7.753 7.938q-.005.007-.012.014a6.9 6.9 0 0 1-9.758-9.76l8.408-8.578.007-.007A4.9 4.9 0 0 1 16 1.1"></path>
                    </svg>
                </button>
            </span>
        </span>
        <span>
            <button class="flex items-center justify-center gap-1 box-border rounded-full border-[0.5px] border-[#C4C4C4] bg-[transparent] text-[#363636] hover:bg-[#0C0C0D0A] active:bg-[#0C0C0D14] cursor-pointer h-8 px-2 transition-[border-color,background-color] duration-100 ease-in-out" style="width: 32px; height: 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[currentColor]">
                    <path fill="#000" d="M7.38 2.127A10.903 10.903 0 0 1 22.9 12v1a3.902 3.902 0 0 1-7.152 2.154 4.9 4.9 0 1 1-.648-6.95V8a.901.901 0 0 1 1.8 0v5a2.1 2.1 0 0 0 2.1 2.1 2.1 2.1 0 0 0 2.1-2.1v-1a9.1 9.1 0 0 0-7.009-8.857A9.102 9.102 0 0 0 3.092 13.86a9.102 9.102 0 0 0 14.368 5.42.9.9 0 0 1 1.08 1.44 10.9 10.9 0 0 1-17.21-6.493 10.9 10.9 0 0 1 6.05-12.1M12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2"></path>
                </svg>
            </button>
        </span>
    </div>
    <div class="flex items-center gap-2">
        <div class="flex items-center gap-0.5">
            <div class="relative box-border h-8 rounded-full border-[0.5px] border-[#C4C4C4] bg-[#F7F7F7] p-0.5">
                <div class="absolute left-0.5 top-0.5 z-0 box-border h-[27px] w-8 rounded-full border-[0.5px] border-[#E3E3E3] bg-[#FFFFFF] transition-transform duration-200" style="box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 16px 0px; transform: translateX(0px);"></div>
                <div class="z-1 relative flex h-7 w-full items-center gap-0.5">
                    <button data-testid="agent-thinking-mode-button" data-value="0" class="flex h-full w-8 flex-shrink-0 cursor-pointer items-center justify-center" data-state="closed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[#363636]">
                            <path fill="#000" d="M15.485 20.14c.284 0 .515.23.515.515 0 .71-.576 1.285-1.286 1.285H9.286c-.71 0-1.286-.575-1.286-1.285 0-.284.23-.515.515-.515zM12 1.334a8 8 0 0 1 4 14.926v1.414c0 .737-.597 1.333-1.333 1.333H9.333A1.333 1.333 0 0 1 8 17.674V16.26a8 8 0 0 1 4-14.927m0 1.8a6.2 6.2 0 0 0-6.192 5.88l-.008.32A6.2 6.2 0 0 0 8.9 14.703l.899.52v1.984h4.4v-1.985l.899-.52A6.2 6.2 0 0 0 18.2 9.335l-.008-.32a6.2 6.2 0 0 0-5.873-5.873z"></path>
                        </svg>
                    </button>
                    <button data-testid="agent-fast-mode-button" data-value="2" class="flex h-full w-8 flex-shrink-0 cursor-pointer items-center justify-center" data-state="closed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[#363636]">
                            <path fill="#000" d="M11.675.965c.517-.26 1.263-.444 2.051-.143.784.3 1.217.93 1.432 1.46.213.525.281 1.098.281 1.635V8.98h2.093l.352.015c.864.07 1.997.425 2.513 1.59.553 1.249-.06 2.406-.615 3.088l-6.085 8.208a2 2 0 0 1-.085.106c-.35.405-.778.793-1.287 1.049-.518.26-1.264.444-2.052.142-.783-.3-1.216-.928-1.431-1.459-.214-.524-.282-1.097-.282-1.634V15.02H6.468c-.88 0-2.276-.275-2.866-1.607-.552-1.248.06-2.405.616-3.087l6.085-8.207.084-.106c.35-.405.778-.794 1.287-1.05m1.964 2.952c0-1.602-.851-1.926-1.89-.725L5.664 11.4c-.87 1-.506 1.821.804 1.822H9.36a1 1 0 0 1 1 1v5.864l.01.285c.091 1.26.803 1.53 1.688.646l.193-.207 6.086-8.209c.87-1 .505-1.82-.805-1.82h-2.893l-.102-.005a1 1 0 0 1-.893-.892l-.005-.103z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="flex items-center justify-center gap-1 box-border rounded-full border-[0.5px] border-[#C4C4C4] bg-[transparent] text-[#363636] hover:bg-[#0C0C0D0A] active:bg-[#0C0C0D14] cursor-pointer h-8 px-2 transition-[border-color,background-color] duration-100 ease-in-out" data-state="closed" style="width: 32px; height: 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[currentColor]">
                    <path fill="#000" d="M11.645 1c6.074 0 11 4.925 11 11s-4.926 11-11 11c-6.075 0-11-4.925-11-11s4.925-11 11-11M2.489 12.9a9.2 9.2 0 0 0 7.056 8.057A15.55 15.55 0 0 1 6.732 12.9zm14.069 0a15.54 15.54 0 0 1-2.814 8.057 9.2 9.2 0 0 0 7.057-8.057zm-8.023 0a13.75 13.75 0 0 0 3.11 7.844 13.75 13.75 0 0 0 3.11-7.844zm1.009-9.856a9.2 9.2 0 0 0-7.055 8.057h4.243a15.55 15.55 0 0 1 2.812-8.057m2.1.212A13.75 13.75 0 0 0 8.536 11.1h6.22a13.75 13.75 0 0 0-3.11-7.845m2.101-.212a15.55 15.55 0 0 1 2.813 8.057H20.8a9.2 9.2 0 0 0-7.056-8.057"></path>
                </svg>
            </button>
            <span type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-_r_14_" data-state="closed" class="agent-ui-popover">
                <button class="flex items-center justify-center gap-1 box-border rounded-full border-[0.5px] border-[#C4C4C4] bg-[transparent] text-[#363636] hover:bg-[#0C0C0D0A] active:bg-[#0C0C0D14] cursor-pointer h-8 px-2" data-testid="agent-custom-settings-button" data-state="closed">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="[&amp;_path]:fill-[currentColor]">
                    <path fill="#000" d="M10.8 1.307a2.33 2.33 0 0 1 2.4 0l7.67 4.602A2.33 2.33 0 0 1 22 7.907v8.361a2.33 2.33 0 0 1-1.13 1.998l-7.67 4.602-.141.078a2.33 2.33 0 0 1-2.258-.078l-7.67-4.602A2.33 2.33 0 0 1 2 16.268V7.907a2.33 2.33 0 0 1 1.003-1.915l.128-.083zm-7 14.961a.53.53 0 0 0 .258.454l7.06 4.235V13.15L3.8 8.925zm9.118-3.136v7.805l7.024-4.215a.53.53 0 0 0 .258-.454v-7.34zM12.273 2.85a.53.53 0 0 0-.546 0L4.444 7.22l7.558 4.364 7.556-4.363z"></path>
                </svg>
                </button>
            </span>
        </div>
        <button class="h-8 min-w-8 rounded-full bg-[#2F3640] flex items-center justify-center enabled:hover:bg-[#4A535F] enabled:active:bg-[#191E26] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30" data-testid="agent-send-button" data-state="closed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="h-[16px] w-[16px] [&amp;_path]:fill-white">
                <path fill="#000" d="M17.576 3.999A2.424 2.424 0 0 1 20 6.423v11.152A2.424 2.424 0 0 1 17.576 20H6.424A2.424 2.424 0 0 1 4 17.575V6.423a2.424 2.424 0 0 1 2.424-2.424z"></path>
            </svg>
        </button>
    </div>
</div>
