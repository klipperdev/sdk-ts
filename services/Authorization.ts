/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosBasicCredentials} from 'axios';
import {Canceler} from '@klipper/http-client/Canceler';
import {BaseService} from '../BaseService';
import {CredentialsRequest} from '../models/requests/CredentialsRequest';
import {OauthTokenResponse} from '../models/responses/OauthTokenResponse';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class Authorization extends BaseService {
    public static getName() {
        return 'Authorization';
    }

    public async login(credentials: CredentialsRequest, canceler?: Canceler): Promise<OauthTokenResponse> {
        const data = new FormData();
        data.set('grant_type', 'password');
        data.set('client_id', this.client.oauthConfig.clientId);
        data.set('scope', this.client.oauthConfig.scope);
        data.set('username', credentials.username);
        data.set('password', credentials.password);

        return await this.client.request<OauthTokenResponse>({
            method: 'POST',
            baseURL: this.client.oauthConfig.baseUrl,
            url: '/oauth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {} as AxiosBasicCredentials,
            data,
        }, canceler) as OauthTokenResponse;
    }

    public async logout(canceler?: Canceler): Promise<null> {
        return await this.client.request<null>({
            method: 'PUT',
            url: '/logout',
        }, canceler);
    }
}
