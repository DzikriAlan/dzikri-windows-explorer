#!/bin/bash

echo "🚀 Setting up Windows Explorer project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if MySQL is installed  
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment file
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the DATABASE_URL in .env file with your MySQL credentials"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎉 To start the development server:"
echo "   npm run dev"
echo ""
echo "📚 Other useful commands:"
echo "   npm run db:studio  - Open Prisma Studio"
echo "   npm run db:reset   - Reset database"
echo "   npm run build      - Build for production"
echo ""