import { PublicationState } from '@/constants/enum';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { StrapiPaginationInput } from './dto/query.input';

@Injectable()
export class StrapiService {
    private readonly client: AxiosInstance;

    constructor(private readonly configService: ConfigService) {
        this.client = axios.create({
            baseURL: `${this.configService.get('strapi.url')}/api`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.configService.get('strapi.apiToken')}`,
            },
        });
    }

    extractErrorMessage(e: any) {
        const errorDetails = e?.response?.data?.error?.details?.errors || [];
        if (errorDetails.length > 0) {
            throw new InternalServerErrorException(`${errorDetails[0].path}: ${errorDetails[0].message}`);
        } else if (axios.isAxiosError(e)) {
            throw new HttpException(e?.response?.data?.error?.message, e?.response?.status);
        } else {
            throw new InternalServerErrorException(e);
        }
    }

    async createEntry(path: string, data: Record<string, any>) {
        try {
            const params = {
                populate: '*',
            }
            const res = await this.client.post(path, { data }, { params });
            return res.data;
        } catch (e) {
            this.extractErrorMessage(e);
        }
    }

    async getEntry(path: string, documentId: string) {
        try {
            const params = {
                populate: '*',
            }
            const res = await this.client.get(`${path}/${documentId}`, { params });
            return res.data;
        } catch (e) {
            this.extractErrorMessage(e);
        }
    }

    async searchEntries(
        path: string,
        options: {
            filters?: Record<string, any>,
            sort?: string[] | string,
            pagination?: StrapiPaginationInput,
            publicationState?: PublicationState
        } = {},
    ) {
        try {
            const params = {
                populate: '*',
                ...options,
            }
            const res = await this.client.get(path, { params });
            return res.data;
        } catch (e) {
            this.extractErrorMessage(e);
        }
    }

    async updateEntry(path: string, documentId: string, data: Record<string, any>) {
        try {
            const params = {
                populate: '*',
            }
            const res = await this.client.put(`${path}/${documentId}`, { data }, { params });
            return res.data;
        } catch (e) {
            this.extractErrorMessage(e);
        }
    }

    async deleteEntry(path: string, documentId: string) {
        try {
            const res = await this.client.delete(`${path}/${documentId}`);
            return res.data;
        } catch (e) {
            this.extractErrorMessage(e);
        }
    }
}
