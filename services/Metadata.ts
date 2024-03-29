/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {BaseService} from '@klipper/sdk/BaseService';
import {ObjectMetadataDetailsResponse} from '@klipper/sdk/models/responses/metadata/ObjectMetadataDetailsResponse';
import {ObjectMetadataResponse} from '@klipper/sdk/models/responses/metadata/ObjectMetadataResponse';
import {SystemChoiceResponse} from '@klipper/sdk/models/responses/metadata/SystemChoiceResponse';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class Metadata extends BaseService {
    public static getName() {
        return 'Metadata';
    }

    public async all(organization: string = 'user', canceler?: Canceler): Promise<ObjectMetadataResponse[]> {
        return await this.client.request<ObjectMetadataResponse[]>({
            method: 'GET',
            url: '/' + organization + '/metadatas',
        }, canceler) as ObjectMetadataResponse[];
    }

    public async allDetails(organization: string = 'user', canceler?: Canceler): Promise<ObjectMetadataDetailsResponse[]> {
        return await this.client.request<ObjectMetadataResponse[]>({
            method: 'GET',
            url: '/' + organization + '/metadatas',
            headers: {
                'X-Metadata-Details': true,
            },
        }, canceler) as ObjectMetadataDetailsResponse[];
    }

    public async systemChoices(organization: string = 'user', canceler?: Canceler): Promise<SystemChoiceResponse[]> {
        return await this.client.request<SystemChoiceResponse[]>({
            method: 'GET',
            url: '/' + organization + '/metadatas/choices',
        }, canceler) as SystemChoiceResponse[];
    }
}
