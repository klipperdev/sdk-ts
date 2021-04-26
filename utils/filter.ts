/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isObject} from '@klipper/bow/utils/object';
import {Filter} from '@klipper/sdk/models/filters/Filter';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';

/**
 * Merge the rules for filter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function mergeFilterRules(...rules: Array<Filter|null|undefined>): Array<Filter> {
    const validRules = [] as Array<Filter>;

    for (const rule of rules) {
        if (rule && isObject(rule)) {
            validRules.push(rule);
        }
    }

    return validRules;
}
