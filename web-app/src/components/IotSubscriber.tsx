import React, { useEffect, useState } from 'react';
import AwsIotService from '../services/aws-iot-service';
import './IotSubscriber.css';

interface Message {
    topic: string;
    payload: string;
    timestamp: Date;
}

const IotSubscriber: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [topic, setTopic] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const connectToIot = async () => {
            try {
                const iotService = AwsIotService.getInstance();
                await iotService.connect();
                setIsConnected(true);
            } catch (err) {
                setError('Failed to connect to AWS IoT Core');
                console.error(err);
            }
        };

        connectToIot();

        return () => {
            AwsIotService.getInstance().disconnect();
        };
    }, []);

    const handleSubscribe = async () => {
        if (!topic) {
            setError('Please enter a topic');
            return;
        }

        try {
            const iotService = AwsIotService.getInstance();
            await iotService.subscribe(topic, (topic, payload) => {
                setMessages(prev => [...prev, {
                    topic,
                    payload,
                    timestamp: new Date()
                }]);
            });
        } catch (err) {
            setError('Failed to subscribe to topic');
            console.error(err);
        }
    };

    return (
        <div className="iot-subscriber">
            <h2>AWS IoT Core Subscriber</h2>
            
            <div className={`connection-status ${!isConnected ? 'disconnected' : ''}`}>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            <div className="subscription-form">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic to subscribe"
                />
                <button onClick={handleSubscribe} disabled={!isConnected}>
                    Subscribe
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="messages">
                <h3>Messages</h3>
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <div className="message-header">
                            <span className="topic">{msg.topic}</span>
                            <span className="timestamp">
                                {msg.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="payload">{msg.payload}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IotSubscriber; 