import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const serverEndpoint = 'http://localhost:3000'; // Replace with your server URL

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(serverEndpoint);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('chat message', (msg: string) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket) {
            socket.emit('chat message', currentMessage);
            setCurrentMessage('');
        }
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatApp;
