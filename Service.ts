/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from './KlipperClient';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface Service {
}

/**
 * Interface of service constructor.
 */
export interface ServiceConstructor {
    new(client: KlipperClient): Service;

    /**
     * Get the unique name of service.
     */
    getName(): string;
}
