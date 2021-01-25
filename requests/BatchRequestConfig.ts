/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BatchRequest} from '@klipper/http-client/models/requests/BatchRequest';
import {CommonRequestConfig} from '@klipper/sdk/requests/CommonRequestConfig';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface BatchRequestConfig<R = Record<string, any>> extends CommonRequestConfig {
    transactional?: boolean;
    data: BatchRequest;
}
