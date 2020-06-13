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
import {ListRequestConfig} from './ListRequestConfig';
import {OauthConfig} from './OauthConfig';
import {createApiError} from './utils/error';
import {Service, ServiceConstructor} from './Service';
import {ServiceNotFoundError} from './errors/ServiceNotFoundError';

const SERVICES: ServiceConstructor[] = [
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
     * Build and run the request.
     */
    public async request<T = MapKey>(config: AxiosRequestConfig, canceler?: Canceler): Promise<T|null> {
        if (canceler) {
            config.cancelToken = new axios.CancelToken(function executor(c) {
                canceler.setExecutor(c);
            });
        }

        try {
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
        if (!config.method) {
            config.method = 'GET';
        }

        if (undefined !== config.page) {
            config.params = config.params || {};
            config.params.page = config.page;
        }

        if (undefined !== config.limit) {
            config.params = config.params || {};
            config.params.limit = config.limit;
        }

        const res = await this.request<ListResponse<T>>(config, canceler);

        return res ? res : {results: [], page: 1, limit: 1, pages: 1, total: 0} as ListResponse<T>;
    }
}
