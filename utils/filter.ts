/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isObject} from '@klipper/bow/utils/object';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';

/**
 * Merge the rules for filter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function mergeFilterRules(...rules: Array<FilterRule|FilterCondition|null|undefined>): Array<FilterRule|FilterCondition> {
    const validRules = [] as Array<FilterRule|FilterCondition>;

    for (const rule of rules) {
        if (rule && isObject(rule)) {
            validRules.push(rule);
        }
    }

    return validRules;
}
