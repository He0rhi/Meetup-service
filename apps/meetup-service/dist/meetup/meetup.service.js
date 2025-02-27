"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetupService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let MeetupService = class MeetupService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    // Создание митапа
    create(meetupData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.meetup.create({
                data: {
                    title: meetupData.title,
                    lat: meetupData.lat,
                    lng: meetupData.lng,
                    date: meetupData.date,
                },
            });
        });
    }
    // Получить все митапы
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.meetup.findMany();
        });
    }
    // Получить один митап по ID
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.meetup.findUnique({ where: { id } });
        });
    }
    // Удаление митапа
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.meetup.delete({ where: { id } });
        });
    }
    // Обновление митапа
    update(id, meetupData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.meetup.update({
                where: { id },
                data: Object.assign(Object.assign({}, meetupData), { date: meetupData.date ? new Date(meetupData.date).toISOString() : undefined }),
            });
        });
    }
    // Поиск митапов в радиусе 100 км
    findWithinRadius(lat_1, lng_1) {
        return __awaiter(this, arguments, void 0, function* (lat, lng, radiusKm = 100) {
            const radiusInDegrees = radiusKm / 111.32; // Примерное преобразование км в градусы
            return this.prisma.meetup.findMany({
                where: {
                    lat: { gte: lat - radiusInDegrees, lte: lat + radiusInDegrees },
                    lng: { gte: lng - radiusInDegrees, lte: lng + radiusInDegrees },
                },
            });
        });
    }
};
exports.MeetupService = MeetupService;
exports.MeetupService = MeetupService = __decorate([
    (0, common_1.Injectable)()
], MeetupService);
