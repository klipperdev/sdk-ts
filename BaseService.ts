/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Service} from '@klipper/sdk/Service';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class BaseService implements Service {
    protected readonly client: KlipperClient;

    constructor(client: KlipperClient) {
        this.client = client;
    }
}
