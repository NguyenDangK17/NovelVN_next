'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/UserContext';
import io, { Socket } from 'socket.io-client';
import Image from 'next/image';
import { User } from '@/types/user';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface ChatMessage {
  from: string;
  to: string;
  message: string;
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [online, setOnline] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  // Fetch users
  useEffect(() => {
    if (!user || !user.token) return;
    setLoadingUsers(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.filter((u: User) => u._id !== user._id));
        setLoadingUsers(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoadingUsers(false);
      });
  }, [user]);

  // Fetch other user info when selected
  useEffect(() => {
    if (!selectedUser) return setOtherUser(null);
    setOtherUser(selectedUser);
  }, [selectedUser]);

  // Socket connection and chat logic
  useEffect(() => {
    if (!user || !user.token || !selectedUser) return;
    setLoadingChat(true);
    const socket = io(SOCKET_URL, {
      auth: { token: user.token },
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setLoadingChat(false);
      socket.emit('join', { toUserId: selectedUser._id });
    });
    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
      setTimeout(() => scrollToBottom(), 100);
    });
    socket.on('receive_message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => scrollToBottom(), 100);
    });
    socket.on('online', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    socket.on('connect_error', () => setOnline(false));

    return () => {
      socket.disconnect();
      setMessages([]);
      setOnline(false);
    };
    // eslint-disable-next-line
  }, [user, selectedUser]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !selectedUser) return;
    socketRef.current.emit('send_message', { toUserId: selectedUser._id, message: input });
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        You must be logged in to chat.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#18181b] pt-16">
      {/* Left: User List/Search */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-[#23232a] bg-[#23232a] flex flex-col">
        <div className="p-4 border-b border-[#23232a]">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-[#18181b] text-white border border-[#23232a] focus:outline-none"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingUsers ? (
            <div className="text-gray-400 text-center mt-8">Loading users...</div>
          ) : error ? (
            <div className="text-red-400 text-center mt-8">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">No users found.</div>
          ) : (
            <ul>
              {filteredUsers.map(u => (
                <li key={u._id}>
                  <button
                    onClick={() => setSelectedUser(u)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#18181b] transition cursor-pointer ${selectedUser?._id === u._id ? 'bg-[#18181b]' : ''}`}
                  >
                    <Image
                      src={u.avatar || '/default-avatar.png'}
                      alt={u.username}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-gray-500"
                    />
                    <span className="text-white font-medium">{u.username}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Right: Chat Content or Placeholder */}
      <div className="flex-1 flex flex-col bg-[#18181b]">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-[#23232a] bg-[#23232a]">
              <button onClick={() => setSelectedUser(null)} className="text-white text-2xl mr-2">
                ←
              </button>
              {otherUser && (
                <Image
                  src={otherUser.avatar || '/default-avatar.png'}
                  alt={otherUser.username}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-gray-500"
                />
              )}
              <div>
                <div className="text-lg font-bold text-white">{otherUser?.username || 'User'}</div>
                <div className={`text-xs ${online ? 'text-green-400' : 'text-gray-400'}`}>
                  {online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-[#18181b]">
              {loadingChat ? (
                <div className="text-gray-400 text-center mt-8">Connecting...</div>
              ) : messages.length === 0 ? (
                <div className="text-gray-400 text-center mt-8">No messages yet. Say hi!</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow text-sm break-words ${
                        msg.from === user._id
                          ? 'bg-primary-500 text-white rounded-br-none'
                          : 'bg-[#23232a] text-white rounded-bl-none'
                      }`}
                    >
                      <div>{msg.message}</div>
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input bar */}
            <div className="p-4 border-t border-[#23232a] bg-[#23232a] flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg bg-[#18181b] text-white border border-[#23232a] focus:outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button
                onClick={sendMessage}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Messenger</div>
              <div className="text-gray-400">Select a user to start chatting.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
