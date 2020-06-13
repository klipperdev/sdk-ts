/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';
import {MapKey} from '@klipper/http-client/models/MapKey';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface KlipperClientConfig {
    baseUrl: string;
    timeout?: number;
    maxRedirects?: number;
    headers?: MapKey<string>;
    axiosConfig?: AxiosRequestConfig;
}
