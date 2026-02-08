import { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimChat, sendChatMessage, ChatMessage } from '../api/services';
import { Send, ArrowLeft, Info, AlertCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const ClaimChat: React.FC = () => {
    const { claimId } = useParams<{ claimId: string }>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (claimId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [claimId]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await getClaimChat(claimId!);
            setMessages(response.data || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            await sendChatMessage(claimId!, newMessage);
            setNewMessage('');
            await fetchMessages();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4 bg-white/50 p-2 rounded-2xl backdrop-blur-sm">
                    <button
                        onClick={() => navigate('/my-claims')}
                        className="group flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">All Claims</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Live Support
                    </div>
                </div>

                {/* Main Chat Container */}
                <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col overflow-hidden">
                    {/* Chat Header Info */}
                    <div className="p-5 border-b border-gray-50 flex items-center gap-4 bg-gradient-to-r from-white to-indigo-50/30">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Claim Assistant</h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Usually responds in few hours
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-gray-400 text-sm animate-pulse">Syncing conversation...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Send className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-gray-400 font-medium">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {messages.map((message) => {
                                    const isOwnMessage = message.senderId === user?.uid;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={message.id}
                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] md:max-w-[70%] group`}>
                                                {!isOwnMessage && (
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1 mb-1 block">
                                                        {message.senderName}
                                                    </span>
                                                )}
                                                
                                                <div className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all ${
                                                    isOwnMessage
                                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-200'
                                                        : message.isProofRequest
                                                            ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-none'
                                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                }`}>
                                                    {message.isProofRequest && (
                                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200/50 text-amber-700">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-xs font-bold uppercase tracking-tight">Action Required</span>
                                                        </div>
                                                    )}
                                                    
                                                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                    
                                                    <p className={`text-[10px] mt-2 font-medium flex justify-end ${
                                                        isOwnMessage ? 'text-indigo-200' : 'text-gray-400'
                                                    }`}>
                                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                        <form 
                            onSubmit={handleSend} 
                            className="relative flex items-center bg-white rounded-2xl border border-gray-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all p-1.5 shadow-inner"
                        >
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-40 disabled:grayscale shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                {sending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                        <p className="text-[10px] text-center text-gray-400 mt-3 italic">
                            All messages are logged for security purposes.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ClaimChat;