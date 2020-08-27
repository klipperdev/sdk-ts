/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {RequestConfigType} from '@klipper/sdk/requests/RequestConfigTypes';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface RequestConfigItem {
    config: RequestConfigType;
    canceler?: Canceler;
}
