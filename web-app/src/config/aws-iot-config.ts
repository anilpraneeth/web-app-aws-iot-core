// Validate required environment variables
const requiredEnvVars = [
    'REACT_APP_AWS_REGION',
    'REACT_APP_AWS_IOT_ENDPOINT',
    'REACT_APP_CERT_PATH',
    'REACT_APP_KEY_PATH'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
    }
});

interface AwsIotConfig {
    region: string;
    endpoint: string | undefined;
    clientId: string;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
}

const awsIotConfig: AwsIotConfig = {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    endpoint: process.env.REACT_APP_AWS_IOT_ENDPOINT,
    clientId: `web-app-${Math.random().toString(36).substring(2, 8)}`,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
};

export { awsIotConfig };
export type { AwsIotConfig }; 