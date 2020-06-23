/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListRequestConfig} from './ListRequestConfig';
import {RequestConfig} from './RequestConfig';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface RequestConfigItem {
    config: AxiosRequestConfig|RequestConfig|ListRequestConfig;
    canceler?: Canceler;
}
