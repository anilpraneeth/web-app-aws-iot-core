#!/bin/bash

# Create a directory for certificates
mkdir -p certificates

# Generate private key
openssl genrsa -out certificates/private.pem.key 2048

# Generate CSR (Certificate Signing Request)
openssl req -new -key certificates/private.pem.key -out certificates/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=Device"

# Generate self-signed certificate (for testing)
openssl x509 -req -days 365 -in certificates/certificate.csr -signkey certificates/private.pem.key -out certificates/certificate.pem.crt

echo "Certificates generated successfully in the 'certificates' directory"
echo "Please upload the certificate.csr to AWS IoT Core and download the signed certificate" 