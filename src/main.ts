import { NestFactory } from '@nestjs/core';
import { Controller, Get, Injectable, Module } from '@nestjs/common';
import Airtable from 'Airtable'
const { config } = require('dotenv');

config();
const api_key = process.env.API_KEY
const api_base = process.env.API_BASE
const base = new Airtable({apiKey: api_key}).base(api_base)
const table = base('Seminars')

const formatDate = (raw) => {
  let date = raw.split("T")
  const d = new Date(date[0]).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"}).replaceAll(',', '')
  const t = date[1].slice(0,5) + " UTC"
  return `${d}, ${t}`
}

@Controller()
export class AppController {
  @Get()
  async getSeminars(): Promise<any> {
    const records = await table.select().all()
    let seminars = []

    records.forEach(record => {
      let dayTime = record.fields.Date
      let recordDate = new Date(dayTime as string)
      if (recordDate >= new Date()) {
        seminars.push({
          instructor: record.fields.Instructor,
          seminar: record.fields.Seminar,
          date: formatDate(record.fields.Date)
        })
      }
    })

    return seminars
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
main();
