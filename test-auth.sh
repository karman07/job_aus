#!/bin/bash

# JWT Authentication Flow Test Script
BASE_URL="http://localhost:3001/api"

echo "=== CrossNations JWT Authentication Flow Test ==="
echo

# Test 1: Register a candidate
echo "1. Registering a candidate..."
CANDIDATE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000000"
  }')

echo "Candidate Registration Response:"
echo "$CANDIDATE_RESPONSE" | jq '.'
echo

# Extract candidate access token
CANDIDATE_TOKEN=$(echo "$CANDIDATE_RESPONSE" | jq -r '.data.tokens.accessToken // empty')

# Test 2: Register an employer
echo "2. Registering an employer..."
EMPLOYER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@test.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "password123",
    "role": "employer",
    "phone": "+61400000001"
  }')

echo "Employer Registration Response:"
echo "$EMPLOYER_RESPONSE" | jq '.'
echo

# Extract employer access token
EMPLOYER_TOKEN=$(echo "$EMPLOYER_RESPONSE" | jq -r '.data.tokens.accessToken // empty')

# Test 3: Login as candidate
echo "3. Logging in as candidate..."
CANDIDATE_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "password123"
  }')

echo "Candidate Login Response:"
echo "$CANDIDATE_LOGIN" | jq '.'
echo

# Test 4: Login as employer
echo "4. Logging in as employer..."
EMPLOYER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@test.com",
    "password": "password123"
  }')

echo "Employer Login Response:"
echo "$EMPLOYER_LOGIN" | jq '.'
echo

# Test 5: Get candidate profile
if [ ! -z "$CANDIDATE_TOKEN" ]; then
  echo "5. Getting candidate profile..."
  CANDIDATE_PROFILE=$(curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $CANDIDATE_TOKEN")
  
  echo "Candidate Profile Response:"
  echo "$CANDIDATE_PROFILE" | jq '.'
  echo
fi

# Test 6: Get employer profile
if [ ! -z "$EMPLOYER_TOKEN" ]; then
  echo "6. Getting employer profile..."
  EMPLOYER_PROFILE=$(curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $EMPLOYER_TOKEN")
  
  echo "Employer Profile Response:"
  echo "$EMPLOYER_PROFILE" | jq '.'
  echo
fi

# Test 7: Update company profile (employer only)
if [ ! -z "$EMPLOYER_TOKEN" ]; then
  echo "7. Updating company profile..."
  COMPANY_UPDATE=$(curl -s -X PUT "$BASE_URL/companies/profile" \
    -H "Authorization: Bearer $EMPLOYER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Company Pty Ltd",
      "description": "A test company for demonstration",
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "size": "11-50",
      "website": "https://testcompany.com.au"
    }')
  
  echo "Company Update Response:"
  echo "$COMPANY_UPDATE" | jq '.'
  echo
fi

# Test 8: Create a job (employer only)
if [ ! -z "$EMPLOYER_TOKEN" ]; then
  echo "8. Creating a job as employer..."
  JOB_CREATE=$(curl -s -X POST "$BASE_URL/jobs" \
    -H "Authorization: Bearer $EMPLOYER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Senior Software Developer",
      "description": "We are looking for an experienced software developer",
      "requirements": "5+ years experience in TypeScript and React",
      "keyResponsibilities": "Develop and maintain web applications",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$120,000 - $150,000",
      "tags": "[\"TypeScript\", \"React\", \"Node.js\"]"
    }')
  
  echo "Job Creation Response:"
  echo "$JOB_CREATE" | jq '.'
  echo
fi

# Test 9: Get employer's jobs
if [ ! -z "$EMPLOYER_TOKEN" ]; then
  echo "9. Getting employer's jobs..."
  EMPLOYER_JOBS=$(curl -s -X GET "$BASE_URL/companies/jobs" \
    -H "Authorization: Bearer $EMPLOYER_TOKEN")
  
  echo "Employer Jobs Response:"
  echo "$EMPLOYER_JOBS" | jq '.'
  echo
fi

echo "=== Authentication Flow Test Complete ==="