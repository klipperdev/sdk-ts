/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {OauthConfig} from '@klipper/sdk/OauthConfig';
import {ServiceConstructor} from '@klipper/sdk/Service';
import {AxiosRequestConfig} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface KlipperClientConfig {
    baseUrl: string;
    oauth: OauthConfig,
    timeout?: number;
    maxRedirects?: number;
    headers?: Record<string, string>;
    axiosConfig?: AxiosRequestConfig;
    services?: ServiceConstructor[];
}
