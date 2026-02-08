import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimChat, sendChatMessage, ChatMessage } from '../api/services';
import { Send, ArrowLeft } from 'lucide-react';
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
            const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [claimId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/my-claims')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to My Claims</span>
                </button>

                <div className="bg-gray-900 rounded-xl border border-gray-800">
                    <div className="border-b border-gray-800 p-5">
                        <h2 className="text-xl font-semibold text-white">Claim Chat</h2>
                        <p className="text-sm text-gray-400 mt-1">Communicate with admin about your claim</p>
                    </div>

                    <div className="h-96 overflow-y-auto p-5 space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">No messages yet</div>
                        ) : (
                            messages.map((message: any) => {
                                const senderId = message.senderId || message.senderUid;
                                const isOwnMessage = senderId === user?.uid;
                                const timestamp = message.timestamp
                                    ? (typeof message.timestamp === 'object' && '_seconds' in message.timestamp)
                                        ? new Date(message.timestamp._seconds * 1000)
                                        : new Date(message.timestamp)
                                    : new Date();

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-lg ${isOwnMessage
                                                    ? 'bg-white text-black'
                                                    : message.isProofRequest
                                                        ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800'
                                                        : 'bg-gray-800 text-white'
                                                }`}
                                        >
                                            {!isOwnMessage && (
                                                <p className="text-xs font-semibold mb-1.5">{message.senderName || 'Admin'}</p>
                                            )}
                                            {message.isProofRequest && (
                                                <p className="text-xs font-semibold mb-1.5">⚠️ Proof Request</p>
                                            )}
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <p className={`text-xs mt-1.5 ${isOwnMessage ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="border-t border-gray-800 p-5">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none text-sm text-white placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-white text-black px-4 py-2.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ClaimChat;
