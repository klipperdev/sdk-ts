/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ObjectMetadataResponse} from './ObjectMetadataResponse';
import {FieldMetadataResponse} from './FieldMetadataResponse';
import {AssociationMetadataResponse} from './AssociationMetadataResponse';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ObjectMetadataDetailsResponse extends ObjectMetadataResponse {
    fields?: FieldMetadataResponse[];
    associations?: AssociationMetadataResponse[];
}
