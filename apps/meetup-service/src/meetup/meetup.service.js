"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetupService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto"); 
let MeetupService = class MeetupService {
    constructor() {
        this.meetups = [];
    }
    create(meetupData) {
        const newMeetup = Object.assign({ id: (0, crypto_1.randomUUID)() }, meetupData);
        this.meetups.push(newMeetup);
        return newMeetup;
    }
    findAll() {
        return this.meetups;
    }
    findOne(id) {
        return this.meetups.find((meetup) => meetup.id === id);
    }
    remove(id) {
        this.meetups = this.meetups.filter((meetup) => meetup.id !== id);
    }
};
exports.MeetupService = MeetupService;
exports.MeetupService = MeetupService = __decorate([
    (0, common_1.Injectable)()
], MeetupService);
