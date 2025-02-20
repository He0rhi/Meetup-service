import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class ElasticSearchService {
    private readonly elasticsearchService: ElasticsearchService;

    constructor(elasticsearchService: ElasticsearchService) {
        this.elasticsearchService = elasticsearchService;
    }

    async indexDocument(index: string, id: string, body: any) {
        return await this.elasticsearchService.index({
            index,
            id,
            body,
        });
    }

    async search(index: string, query: any) {
        return await this.elasticsearchService.search({
            index,
            body: {
                query,
            },
        });
    }
}
