#!/bin/bash

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials are not configured. Please configure them first."
    echo "Run: aws configure"
    exit 1
fi

# Create certificates directory
mkdir -p certificates

# Generate private key and CSR
echo "Generating private key and CSR..."
openssl genrsa -out certificates/private.pem.key 2048
openssl req -new -key certificates/private.pem.key -out certificates/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=Device"

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

# Create IoT policy
echo "Creating IoT policy..."
POLICY_DOCUMENT=$(cat << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iot:Connect",
                "iot:Subscribe",
                "iot:Receive"
            ],
            "Resource": [
                "arn:aws:iot:${AWS_REGION}:${AWS_ACCOUNT_ID}:client/\${iot:ClientId}",
                "arn:aws:iot:${AWS_REGION}:${AWS_ACCOUNT_ID}:topic/*"
            ]
        }
    ]
}
EOF
)

aws iot create-policy \
    --policy-name "WebAppPolicy" \
    --policy-document "$POLICY_DOCUMENT" \
    --region "$AWS_REGION"

# Create certificate from CSR
echo "Creating certificate from CSR..."
CERT_ARN=$(aws iot create-certificate-from-csr \
    --certificate-signing-request file://certificates/certificate.csr \
    --set-as-active \
    --region "$AWS_REGION" \
    --query 'certificateArn' \
    --output text)

# Attach policy to certificate
echo "Attaching policy to certificate..."
aws iot attach-policy \
    --policy-name "WebAppPolicy" \
    --target "$CERT_ARN" \
    --region "$AWS_REGION"

# Get certificate ID from ARN
CERT_ID=$(echo "$CERT_ARN" | cut -d'/' -f2)

# Download certificate
echo "Downloading certificate..."
aws iot describe-certificate \
    --certificate-id "$CERT_ID" \
    --region "$AWS_REGION" \
    --query 'certificateDescription.certificatePem' \
    --output text > certificates/certificate.pem.crt

# Get IoT endpoint
echo "Getting IoT endpoint..."
IOT_ENDPOINT=$(aws iot describe-endpoint \
    --endpoint-type iot:Data-ATS \
    --region "$AWS_REGION" \
    --query 'endpointAddress' \
    --output text)

# Update .env file
echo "Updating .env file..."
cat > .env << EOF
REACT_APP_AWS_REGION=${AWS_REGION}
REACT_APP_AWS_IOT_ENDPOINT=${IOT_ENDPOINT}
REACT_APP_CERT_PATH=certificates/certificate.pem.crt
REACT_APP_KEY_PATH=certificates/private.pem.key
EOF

echo "Setup completed successfully!"
echo "Your .env file has been updated with the following values:"
echo "Region: ${AWS_REGION}"
echo "Endpoint: ${IOT_ENDPOINT}"
echo "Certificate: certificates/certificate.pem.crt"
echo "Private Key: certificates/private.pem.key" 