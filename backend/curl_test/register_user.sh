#!/bin/bash

curl -X POST http://localhost:3333/users   -H "Content-Type: application/json"   -d '{
    "email": "user@example.com",
    "password": "secret123",
    "username": "username",
    "firstName": "First Name",
    "lastName": "Last Name"
  }'