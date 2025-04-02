# AWS IoT Core Web Subscriber

A React TypeScript web application that subscribes to AWS IoT Core MQTT topics and displays messages in real-time.

## Prerequisites

- Node.js (v16 or later)
- AWS IoT Core endpoint and credentials
- AWS IoT Core certificate and private key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure AWS IoT Core:
   - Create an IoT Core endpoint in your AWS account
   - Create an IoT Core policy with appropriate permissions
   - Create an IoT Core certificate and download the certificate and private key files
   - Place your certificates in the `certificates/` directory

4. Update the `.env` file with your AWS IoT Core configuration:
   ```
   REACT_APP_AWS_REGION=your-region
   REACT_APP_AWS_IOT_ENDPOINT=your-iot-endpoint.iot.region.amazonaws.com
   REACT_APP_CERT_PATH=path/to/your/certificate.pem.crt
   REACT_APP_KEY_PATH=path/to/your/private.pem.key
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter the MQTT topic you want to subscribe to and click "Subscribe"

4. Messages published to the subscribed topic will appear in real-time

## Features

- Real-time MQTT message subscription
- Connection status indicator
- Message history with timestamps
- Error handling and display
- Responsive design
- TypeScript support for better type safety
- CRACO configuration for custom webpack settings

## Project Structure

- `src/` - Source code files
- `public/` - Static assets
- `certificates/` - AWS IoT Core certificates
- `scripts/` - Utility scripts
- `craco.config.js` - CRACO configuration file
- `tsconfig.json` - TypeScript configuration

## Security Considerations

- Never commit your AWS IoT Core certificates or private keys to version control
- Use appropriate IAM roles and policies for AWS IoT Core access
- Consider using AWS Cognito for user authentication
- Keep your dependencies up to date

## License

MIT
