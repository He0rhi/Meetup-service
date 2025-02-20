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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.MeetupController = void 0;
const common_1 = require("@nestjs/common");
const meetup_service_1 = require("./meetup.service");
const create_meetup_dto_1 = require("./dto/create-meetup.dto");
const create_meetup_pipe_1 = require("./dto/create-meetup.pipe");
const joi_validation_pipe_1 = require("../pipes/joi-validation.pipe");
//import { ElasticSearchService } from './elastic/elastic.service';
let MeetupController = class MeetupController {
    constructor(meetupService /*,    private readonly elasticSearchService: ElasticSearchService*/) {
        this.meetupService = meetupService;
    }
    create(meetupData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdMeetup = yield this.meetupService.create(meetupData);
            console.log('Received data:', meetupData);
            /*await this.elasticSearchService.indexDocument('meetups',createdMeetup.id, meetupData);*/
            return createdMeetup;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.meetupService.findAll();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.meetupService.findOne(id);
        });
    }
    /*
    @Get('/search/:query')
    async searchMeetups(@Param('query') query:string){
      return this.elasticSearchService.search('meetups', {match:{title:query}})
    }
  */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.meetupService.remove(id);
        });
    }
};
exports.MeetupController = MeetupController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new joi_validation_pipe_1.JoiValidationPipe(create_meetup_pipe_1.CreateMeetupSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meetup_dto_1.CreateMeetupDto]),
    __metadata("design:returntype", Promise)
], MeetupController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MeetupController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeetupController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeetupController.prototype, "remove", null);
exports.MeetupController = MeetupController = __decorate([
    (0, common_1.Controller)('meetups'),
    __metadata("design:paramtypes", [meetup_service_1.MeetupService /*,    private readonly elasticSearchService: ElasticSearchService*/])
], MeetupController);
