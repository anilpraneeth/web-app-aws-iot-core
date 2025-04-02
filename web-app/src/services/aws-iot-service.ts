import { auth, mqtt, io, iot } from 'aws-iot-device-sdk-v2';
import { awsIotConfig } from '../config/aws-iot-config';

class AwsIotService {
    private connection: mqtt.MqttClientConnection | null = null;
    private static instance: AwsIotService;
    private subscriptions: Map<string, (topic: string, payload: string) => void> = new Map();

    private constructor() {}

    public static getInstance(): AwsIotService {
        if (!AwsIotService.instance) {
            AwsIotService.instance = new AwsIotService();
        }
        return AwsIotService.instance;
    }

    private async loadCertificateFiles(): Promise<{ cert: string; key: string }> {
        try {
            const [certResponse, keyResponse] = await Promise.all([
                fetch('/certificates/certificate.pem.crt'),
                fetch('/certificates/private.pem.key')
            ]);

            if (!certResponse.ok || !keyResponse.ok) {
                throw new Error('Failed to load certificate files');
            }

            const [certText, keyText] = await Promise.all([
                certResponse.text(),
                keyResponse.text()
            ]);

            // Verify the content is not HTML
            if (certText.includes('<!DOCTYPE html>') || keyText.includes('<!DOCTYPE html>')) {
                throw new Error('Certificate files are not being served correctly');
            }

            return { cert: certText, key: keyText };
        } catch (error) {
            console.error('Error loading certificate files:', error);
            throw error;
        }
    }

    public async connect(): Promise<void> {
        try {
            console.log('Starting AWS IoT Core connection...');
            console.log('Configuration:', {
                endpoint: awsIotConfig.endpoint,
                region: awsIotConfig.region,
                clientId: awsIotConfig.clientId
            });

            if (!awsIotConfig.endpoint) {
                throw new Error('AWS IoT endpoint not configured');
            }

            console.log('Loading certificate files...');
            const { cert, key } = await this.loadCertificateFiles();
            console.log('Certificate files loaded successfully');

            // Create MQTT connection using AWS IoT Device SDK v2
            const config = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
                .with_client_id(awsIotConfig.clientId)
                .with_endpoint(awsIotConfig.endpoint)
                .with_clean_session(false)
                .with_credentials(
                    awsIotConfig.region,
                    awsIotConfig.accessKeyId,
                    awsIotConfig.secretAccessKey,
                    awsIotConfig.sessionToken
                )
                .build();

            console.log('Connection config built successfully');

            const client = new mqtt.MqttClient();
            this.connection = new mqtt.MqttClientConnection(client, config);
            
            if (this.connection) {
                console.log('Attempting to connect...');
                await this.connection.connect();
                console.log('Connected to AWS IoT Core successfully');
            } else {
                throw new Error('Failed to create MQTT connection');
            }
        } catch (error) {
            console.error('Error connecting to AWS IoT Core:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    cause: error.cause
                });
            }
            throw error;
        }
    }

    public async subscribe(topic: string, callback: (topic: string, payload: string) => void): Promise<void> {
        if (!this.connection) {
            throw new Error('Not connected to AWS IoT Core');
        }

        try {
            console.log(`Subscribing to topic: ${topic}`);
            await this.connection.subscribe(
                topic,
                mqtt.QoS.AtLeastOnce,
                (topic, payload) => {
                    const message = new TextDecoder().decode(payload);
                    console.log(`Received message on topic ${topic}:`, message);
                    callback(topic, message);
                }
            );
            this.subscriptions.set(topic, callback);
            console.log(`Successfully subscribed to topic: ${topic}`);
        } catch (error) {
            console.error(`Error subscribing to topic ${topic}:`, error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            try {
                console.log('Disconnecting from AWS IoT Core...');
                await this.connection.disconnect();
                this.connection = null;
                this.subscriptions.clear();
                console.log('Disconnected from AWS IoT Core successfully');
            } catch (error) {
                console.error('Error disconnecting from AWS IoT Core:', error);
                throw error;
            }
        }
    }

    public async publish(topic: string, message: string): Promise<void> {
        if (!this.connection) {
            throw new Error('Not connected to AWS IoT Core');
        }

        try {
            console.log(`Publishing message to topic ${topic}:`, message);
            await this.connection.publish(
                topic,
                message,
                mqtt.QoS.AtLeastOnce
            );
            console.log(`Successfully published message to topic: ${topic}`);
        } catch (error) {
            console.error(`Error publishing to topic ${topic}:`, error);
            throw error;
        }
    }
}

export default AwsIotService; 