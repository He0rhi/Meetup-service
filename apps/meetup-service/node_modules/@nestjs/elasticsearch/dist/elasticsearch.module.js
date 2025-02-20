"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ElasticsearchModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchModule = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_constants_1 = require("./elasticsearch.constants");
const elasticsearch_service_1 = require("./elasticsearch.service");
let ElasticsearchModule = ElasticsearchModule_1 = class ElasticsearchModule {
    static register(options) {
        return {
            module: ElasticsearchModule_1,
            providers: [{ provide: elasticsearch_constants_1.ELASTICSEARCH_MODULE_OPTIONS, useValue: options }]
        };
    }
    static registerAsync(options) {
        return {
            module: ElasticsearchModule_1,
            imports: options.imports || [],
            providers: [...this.createAsyncProviders(options)]
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: elasticsearch_constants_1.ELASTICSEARCH_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: elasticsearch_constants_1.ELASTICSEARCH_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createElasticsearchOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
};
exports.ElasticsearchModule = ElasticsearchModule;
exports.ElasticsearchModule = ElasticsearchModule = ElasticsearchModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [elasticsearch_service_1.ElasticsearchService],
        exports: [elasticsearch_service_1.ElasticsearchService]
    })
], ElasticsearchModule);
