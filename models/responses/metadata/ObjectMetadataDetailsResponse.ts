/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AssociationMetadataResponse} from '@klipper/sdk/models/responses/metadata/AssociationMetadataResponse';
import {FieldMetadataResponse} from '@klipper/sdk/models/responses/metadata/FieldMetadataResponse';
import {ObjectMetadataResponse} from '@klipper/sdk/models/responses/metadata/ObjectMetadataResponse';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ObjectMetadataDetailsResponse extends ObjectMetadataResponse {
    fields?: FieldMetadataResponse[];
    associations?: AssociationMetadataResponse[];
}
