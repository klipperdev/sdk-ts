/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {MapKey} from '@klipper/http-client/models/MapKey';
import {Canceler} from '@klipper/http-client/Canceler';
import {KlipperClientConfig} from './KlipperClientConfig';
import {RequestConfigItem} from './RequestConfigItem';
import {ListRequestConfig} from './ListRequestConfig';
import {RequestConfig} from './RequestConfig';
import {OauthConfig} from './OauthConfig';
import {ServiceNotFoundError} from './errors/ServiceNotFoundError';
import {Service, ServiceConstructor} from './Service';
import {Authorization} from './services/Authorization';
import {createApiError} from './utils/error';
import {removeEmptyRequestAuth} from './interceptors';

const SERVICES: ServiceConstructor[] = [
    Authorization,
];

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class KlipperClient {
    private readonly axios: AxiosInstance;

    public readonly oauthConfig: OauthConfig;

    private readonly services: MapKey<Service> = {};

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
    public async request<T = MapKey>(config: AxiosRequestConfig|RequestConfig, canceler?: Canceler): Promise<T|null> {
        if (canceler) {
            config.cancelToken = new axios.CancelToken((c: Function) => {
                canceler.setExecutor(c);
            });
        }

        try {
            KlipperClient.updateRequestConfig(config);
            const res = await this.axios.request(config);

            return res ? res.data : null;
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
    public async requestList<T = MapKey>(config: ListRequestConfig, canceler?: Canceler): Promise<ListResponse<T>> {
        KlipperClient.updateRequestConfig(config);
        const res = await this.request<ListResponse<T>>(config, canceler);

        return res ? res : {results: [], page: 1, limit: 1, pages: 1, total: 0} as ListResponse<T>;
    }

    private static updateRequestConfig(config: AxiosRequestConfig|RequestConfig|ListRequestConfig): void {
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

        if (undefined !== (config as ListRequestConfig).filter) {
            config.headers = config.headers || {};
            config.headers['X-Filter'] = JSON.stringify((config as ListRequestConfig).filter);
        }

        if (undefined !== (config as ListRequestConfig).search) {
            config.headers = config.headers || {};
            config.headers['X-Search'] = (config as ListRequestConfig).search;
        }

        if (undefined !== (config as RequestConfig|ListRequestConfig).fields) {
            config.headers = config.headers || {};
            config.headers['X-Fields'] = ((config as RequestConfig|ListRequestConfig).fields as string[]).join(',');
        }
    }
}
