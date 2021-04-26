/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Filter} from '@klipper/sdk/models/filters/Filter';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ListViewResponse {
    id: string|number;
    name: string;
    label: string;
    filters: Filter;
    [key: string]: any;
}
