"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetupModule = void 0;
const common_1 = require("@nestjs/common");
const meetup_controller_1 = require("./meetup.controller");
const meetup_service_1 = require("./meetup.service");
//import { ElasticSearchService } from './elastic/elastic.service';
//import { ElasticsearchModule } from '@nestjs/elasticsearch'; 
let MeetupModule = class MeetupModule {
};
exports.MeetupModule = MeetupModule;
exports.MeetupModule = MeetupModule = __decorate([
    (0, common_1.Module)({
        /* imports: [ElasticsearchModule],  */
        controllers: [meetup_controller_1.MeetupController],
        providers: [/*ElasticSearchService,*/ meetup_service_1.MeetupService],
    })
], MeetupModule);
