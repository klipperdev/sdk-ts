/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FilterCondition} from '../models/filters/FilterCondition';
import {FilterRule} from '../models/filters/FilterRule';
import {CommonRequestConfig} from './CommonRequestConfig';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ListRequestConfig extends CommonRequestConfig {
    page?: number;
    limit?: number;
    filter?: FilterCondition|FilterRule;
    search?: string;
}
