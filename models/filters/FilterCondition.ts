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
export interface FilterCondition {
    condition: string;
    rules: Filter[];
}
