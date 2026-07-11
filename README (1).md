{
  "name": "voice-app-backend-api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/platform-express": "^10.3.0",
    "@prisma/client": "^5.16.0",
    "bcrypt": "^5.1.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.0",
    "@types/bcrypt": "^5.0.2",
    "@types/node": "^20.14.10",
    "prisma": "^5.16.0",
    "typescript": "^5.5.3"
  }
}
