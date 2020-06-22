/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';
import {FilterCondition} from './models/filters/FilterCondition';
import {FilterRule} from './models/filters/FilterRule';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ListRequestConfig extends AxiosRequestConfig {
    page?: number;
    limit?: number;
    filter?: FilterCondition|FilterRule;
    search?: string;
}
