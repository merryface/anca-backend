import { NestFactory } from '@nestjs/core';
import { Controller, Get, Injectable, Module } from '@nestjs/common';
import fetch from 'node-fetch';
import Airtable from 'Airtable'
const { config } = require('dotenv');

config();
const api_key = process.env.API_KEY
const api_base = process.env.API_BASE
const base = new Airtable({apiKey: api_key}).base(api_base)
const table = base('Seminars')

// Handle requests
@Controller()
export class AppController {
  // at endpoint localhost:3000/ or in production yourdomain/
  @Get()
  async getDitto(): Promise<any> {
    // const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    // return response.json();
    const records = await table.select().all()
    return records
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function main() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
main();
