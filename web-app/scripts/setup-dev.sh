#!/bin/bash

# Install nvm if not already installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi

# Install and use Node.js LTS version
echo "Installing Node.js LTS version..."
nvm install --lts
nvm use --lts

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_IOT_ENDPOINT=your-iot-endpoint.iot.us-east-1.amazonaws.com
REACT_APP_CERT_PATH=certificates/certificate.pem.crt
REACT_APP_KEY_PATH=certificates/private.pem.key
EOL
fi

# Generate certificates if they don't exist
if [ ! -f "certificates/certificate.pem.crt" ]; then
    echo "Generating certificates..."
    ./scripts/generate-certificates.sh
fi

echo "Development environment setup complete!"
echo "To start the development server, run: npm start" 