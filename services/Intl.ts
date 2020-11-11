/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {BaseService} from '@klipper/sdk/BaseService';
import {AvailableLocaleResponse} from '@klipper/sdk/models/responses/intl/AvailableLocaleResponse';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class Intl extends BaseService {
    public static getName() {
        return 'Intl';
    }

    public async all(organization: string = 'user', canceler?: Canceler): Promise<ListResponse<AvailableLocaleResponse>> {
        return await this.client.request<ListResponse<AvailableLocaleResponse>>({
            method: 'GET',
            url: '/' + organization + '/available_locales',
        }, canceler) as ListResponse<AvailableLocaleResponse>;
    }
}
