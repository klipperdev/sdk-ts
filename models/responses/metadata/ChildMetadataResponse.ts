/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapKey} from '@klipper/http-client/models/MapKey';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ChildMetadataResponse {
    name: string;
    type: string;
    label: number;
    read_only: boolean;
    required: boolean;
    input: string;
    input_config: MapKey;
    editable_permissions: boolean;
}
