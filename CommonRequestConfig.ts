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
export interface CommonRequestConfig extends AxiosRequestConfig {
    acceptVersion?: string;
    timezone?: string;
    fields?: string[];
}
