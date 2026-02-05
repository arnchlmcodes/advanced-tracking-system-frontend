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
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to My Claims</span>
                </button>

                <div className="bg-white rounded-lg shadow">
                    <div className="border-b p-4">
                        <h2 className="text-xl font-semibold text-gray-900">Claim Chat</h2>
                        <p className="text-sm text-gray-600">Communicate with admin about your claim</p>
                    </div>

                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">No messages yet</div>
                        ) : (
                            messages.map((message) => {
                                const isOwnMessage = message.senderId === user?.uid;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                                                    ? 'bg-indigo-600 text-white'
                                                    : message.isProofRequest
                                                        ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            {!isOwnMessage && (
                                                <p className="text-xs font-semibold mb-1">{message.senderName}</p>
                                            )}
                                            {message.isProofRequest && (
                                                <p className="text-xs font-semibold mb-1">⚠️ Proof Request</p>
                                            )}
                                            <p className="text-sm">{message.content}</p>
                                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="border-t p-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
