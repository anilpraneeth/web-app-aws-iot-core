#!/bin/bash

# Create certificates directory if it doesn't exist
mkdir -p certificates

# Generate private key and CSR
echo "Generating private key and CSR..."
openssl genrsa -out certificates/private.pem.key 2048
openssl req -new -key certificates/private.pem.key -out certificates/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=Device"

echo "Certificate files generated:"
echo "1. certificates/private.pem.key"
echo "2. certificates/certificate.csr"
echo ""
echo "Next steps:"
echo "1. Go to AWS IoT Core Console → Security → Certificates"
echo "2. Click 'Create certificate'"
echo "3. Choose 'Create with CSR'"
echo "4. Upload the 'certificates/certificate.csr' file"
echo "5. Download the signed certificate"
echo "6. Save it as 'certificates/certificate.pem.crt'"
echo ""
echo "After completing these steps, update your .env file with:"
echo "1. Your AWS IoT Core endpoint from Settings"
echo "2. The correct paths to your certificate files" 