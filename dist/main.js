"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const airtable_1 = __importDefault(require("airtable"));
const { config } = require('dotenv');
config();
const api_key = process.env.API_KEY;
const api_base = process.env.API_BASE;
const base = new airtable_1.default({ apiKey: api_key }).base(api_base);
const table = base('Seminars');
const formatDate = (raw) => {
    let date = raw.split("T");
    const d = new Date(date[0]).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "long", day: "numeric" }).replaceAll(',', '');
    const t = date[1].slice(0, 5) + " UTC";
    return `${d}, ${t}`;
};
let AppController = class AppController {
    async getSeminars() {
        const records = await table.select().all();
        let seminars = [];
        records.forEach(record => {
            let dayTime = record.fields.Date;
            let recordDate = new Date(dayTime);
            if (recordDate >= new Date()) {
                seminars.push({
                    instructor: record.fields.Instructor,
                    seminar: record.fields.Seminar,
                    date: formatDate(record.fields.Date)
                });
            }
        });
        return seminars;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSeminars", null);
AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
exports.AppController = AppController;
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [AppController],
    })
], AppModule);
async function main() {
    const app = await core_1.NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);
}
main();
//# sourceMappingURL=main.js.map