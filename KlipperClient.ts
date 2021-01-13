/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {ServiceNotFoundError} from '@klipper/sdk/errors/ServiceNotFoundError';
import {removeEmptyRequestAuth} from '@klipper/sdk/interceptors';
import {KlipperClientConfig} from '@klipper/sdk/KlipperClientConfig';
import {OauthConfig} from '@klipper/sdk/OauthConfig';
import {BatchRequestConfig} from '@klipper/sdk/requests/BatchRequestConfig';
import {CancelerCancelToken} from '@klipper/sdk/requests/CancelerCancelToken';
import {CommonRequestConfig} from '@klipper/sdk/requests/CommonRequestConfig';
import {DeleteRequestConfig} from '@klipper/sdk/requests/DeleteRequestConfig';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {MetadataRequestConfig} from '@klipper/sdk/requests/MetadataRequestConfig';
import {RequestConfigItem} from '@klipper/sdk/requests/RequestConfigItem';
import {RequestConfigType} from '@klipper/sdk/requests/RequestConfigTypes';
import {SearchRequestConfig} from '@klipper/sdk/requests/SearchRequestConfig';
import {Sort} from '@klipper/sdk/requests/Sort';
import {Service, ServiceConstructor} from '@klipper/sdk/Service';
import {Authorization} from '@klipper/sdk/services/Authorization';
import {Intl} from '@klipper/sdk/services/Intl';
import {Metadata} from '@klipper/sdk/services/Metadata';
import {createApiError} from '@klipper/sdk/utils/error';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const SERVICES: ServiceConstructor[] = [
    Authorization,
    Intl,
    Metadata,
];

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class KlipperClient {
    private readonly axios: AxiosInstance;

    public readonly oauthConfig: OauthConfig;

    private readonly services: Record<string, Service> = {};

    constructor(config: KlipperClientConfig) {
        const axiosConfig = config.axiosConfig || {};
        axiosConfig.baseURL = config.baseUrl;
        axiosConfig.timeout = config.timeout;
        axiosConfig.maxRedirects = axiosConfig.maxRedirects || axiosConfig.maxRedirects;
        axiosConfig.headers = Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, config.headers || {});

        this.axios = axios.create(axiosConfig);
        this.oauthConfig = config.oauth;

        const services = config.services ? config.services : SERVICES;

        for (const service of services) {
            this.add(service);
        }

        this.addRequestInterceptor(removeEmptyRequestAuth);
    }

    /**
     * Add the api service.
     */
    public add(service: ServiceConstructor): void {
        if (typeof service === 'function' && service.getName()) {
            this.services[service.getName()] = new service(this);
        }
    }

    /**
     * Get the api service.
     */
    public get<T extends Service>(service: ServiceConstructor | string): T {
        let name = null;

        if (typeof service === 'string') {
            name = service;
        } else if (service.hasOwnProperty('getName')) {
            name = (service as ServiceConstructor).getName();
        } else {
            throw new ServiceNotFoundError(service);
        }

        if (!this.services[name]) {
            throw new ServiceNotFoundError(name);
        }

        return this.services[name] as T;
    }

    public getBaseUrl(): string {
        return this.axios.defaults.baseURL as string;
    }

    /**
     * Add a request interceptor.
     */
    public addRequestInterceptor(onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig|Promise<AxiosRequestConfig>, onRejected?: (error: any) => any): number {
        return this.axios.interceptors.request.use(onFulfilled, onRejected);
    }

    /**
     * Add response interceptor.
     */
    public addResponseInterceptor(onFulfilled?: (value: AxiosResponse) => AxiosResponse|Promise<AxiosResponse>, onRejected?: (error: any) => any): number {
        return this.axios.interceptors.response.use(onFulfilled, onRejected);
    }

    /**
     * Build and run requests in parallel.
     */
    public async requestAll<T = any>(requestConfigs: RequestConfigItem[]): Promise<(T|null)[]> {
        const requests = [] as Promise<AxiosResponse<any>>[];
        const response = [] as (T|null)[];

        for (const requestConfig of requestConfigs) {
            if (requestConfig.canceler) {
                requestConfig.config.cancelToken = new axios.CancelToken((c: Function) => {
                    (requestConfig.canceler as Canceler).setExecutor(c);
                });
            }

            KlipperClient.updateRequestConfig(requestConfig.config);
            requests.push(this.axios.request<T>(requestConfig.config));
            response.push(null);
        }

        try {
            const results = await axios.all(requests);

            for (let i = 0; i < results.length; ++i) {
                response[i] = results[i] ? results[i].data : null;
            }
        } catch (e) {
            if (!axios.isCancel(e)) {
                throw createApiError(e);
            }
        }

        return response;
    }

    /**
     * Build and run the request.
     */
    public async request<T = Record<string, any>>(config: RequestConfigType, canceler?: Canceler): Promise<T|null> {
        const res = await this.requestRaw<T>(config, canceler);

        return res ? res.data : null;
    }

    /**
     * Build and run the raw request.
     */
    public async requestRaw<T = any>(config: RequestConfigType, canceler?: Canceler): Promise<AxiosResponse<T>|null> {
        if (canceler) {
            config.cancelToken = new axios.CancelToken((c: Function) => {
                canceler.setExecutor(c);
            });
            (config.cancelToken as CancelerCancelToken).originalCanceler = canceler;
        }

        try {
            KlipperClient.updateRequestConfig(config);

            return await this.axios.request(config);
        } catch (e) {
            if (!axios.isCancel(e)) {
                throw createApiError(e);
            }
        }

        return null;
    }

    /**
     * Build and run the request.
     */
    public async requestList<T = Record<string, any>>(config: ListRequestConfig|AxiosRequestConfig, canceler?: Canceler): Promise<ListResponse<T>> {
        const res = await this.request<ListResponse<T>>(config, canceler);

        return res ? res : {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<T>;
    }

    private static updateRequestConfig(config: RequestConfigType): void {
        if (!config.method) {
            config.method = 'GET';
        }

        if (undefined !== (config as ListRequestConfig).page) {
            config.params = config.params || {};
            config.params.page = (config as ListRequestConfig).page;
        }

        if (undefined !== (config as ListRequestConfig).limit) {
            config.params = config.params || {};
            config.params.limit = (config as ListRequestConfig).limit;
        }

        if (undefined !== (config as ListRequestConfig).sort) {
            const sort: Sort|Sort[] = (config as ListRequestConfig).sort as Sort|Sort[];
            config.headers = config.headers || {};
            config.headers['X-Sort'] = (typeof sort === 'object' ? [sort as Sort] : sort).toString();
        }

        if (undefined !== (config as ListRequestConfig).filter) {
            config.headers = config.headers || {};
            config.headers['X-Filter'] = JSON.stringify((config as ListRequestConfig).filter);
        }

        if (undefined !== (config as ListRequestConfig).search) {
            config.headers = config.headers || {};
            config.headers['X-Search'] = (config as ListRequestConfig).search;
        }

        if (undefined !== (config as ListRequestConfig).searchFields) {
            config.headers = config.headers || {};
            config.headers['X-Search-Fields'] = ((config as ListRequestConfig).searchFields as string[]).join(',');
        }

        if (undefined !== (config as ListRequestConfig).viewsDetails) {
            config.headers = config.headers || {};
            config.headers['X-Views-Details'] = 'true';
        }

        if (undefined !== (config as CommonRequestConfig).fields) {
            config.headers = config.headers || {};
            config.headers['X-Fields'] = ((config as CommonRequestConfig).fields as string[]).join(',');
        }

        if (undefined !== (config as CommonRequestConfig).timezone) {
            config.headers = config.headers || {};
            config.headers['X-Timezone'] = (config as CommonRequestConfig).timezone;
        }

        if (undefined !== (config as CommonRequestConfig).acceptVersion) {
            config.headers = config.headers || {};
            config.headers['X-Accept-Version'] = (config as CommonRequestConfig).acceptVersion;
        }

        if ((config as DeleteRequestConfig).forceDelete) {
            config.headers = config.headers || {};
            config.headers['X-Force-Delete'] = 'true';
        }

        if ((config as BatchRequestConfig).transactional) {
            config.headers = config.headers || {};
            config.headers['X-Transactional'] = 'true';
        }

        if (undefined !== (config as SearchRequestConfig).query) {
            config.headers = config.headers || {};
            config.headers['X-Query'] = (config as SearchRequestConfig).query;

            if (undefined !== (config as SearchRequestConfig).queryFields) {
                config.headers = config.headers || {};
                config.headers['X-Query-Fields'] = (config as SearchRequestConfig).queryFields;
            }

            if (undefined !== (config as SearchRequestConfig).objects) {
                config.headers['X-Objects'] = ((config as SearchRequestConfig).objects as string[]).join(',');
            }
        }

        if ((config as MetadataRequestConfig).metadataDetails) {
            config.headers = config.headers || {};
            config.headers['X-Metadata-Details'] = 'true';
        }
    }
}
