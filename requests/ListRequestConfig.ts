/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {CommonRequestConfig} from '@klipper/sdk/requests/CommonRequestConfig';
import {Sort} from '@klipper/sdk/requests/Sort';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ListRequestConfig extends CommonRequestConfig {
    page?: number;
    limit?: number;
    sort?: Sort|Sort[]|string|string[],
    filter?: FilterCondition|FilterRule;
    search?: string;
    searchFields?: string[];
    viewsDetails?: boolean;
}
