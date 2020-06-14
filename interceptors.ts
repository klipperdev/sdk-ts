/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function removeEmptyRequestAuth(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config.auth && 0 === Object.keys(config.auth as object).length) {
        config.auth = undefined;
    }

    return config;
}
