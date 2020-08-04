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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ListViewResponse {
    id: string|number;
    name: number;
    label: string;
    filters: FilterCondition|FilterRule;
    [key: string]: any;
}
