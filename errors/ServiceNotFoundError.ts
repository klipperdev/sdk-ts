/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpClientError} from '@klipper/http-client/errors/HttpClientError';
import {ServiceConstructor} from '@klipper/sdk/Service';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class ServiceNotFoundError extends HttpClientError {
    constructor(service: ServiceConstructor|string) {
        super(`The Klipper service "${service}" is not found`);
    }
}
