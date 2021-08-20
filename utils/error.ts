/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Errors} from '@klipper/http-client/models/responses/Errors';
import {AxiosError, AxiosResponse} from 'axios';

/**
 * Create the error for the api.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export async function createApiError(error: Error): Promise<HttpClientRequestError> {
    let message: string = 'Error network';
    let statusCode: number = 0;
    const errors = {errors: []} as Errors;

    if ((error as AxiosError).response && ((error as AxiosError).response as AxiosResponse).status) {
        statusCode = ((error as AxiosError).response as AxiosResponse).status;

        if (((error as AxiosError).response as AxiosResponse).data) {
            let data = ((error as AxiosError).response as AxiosResponse).data;

            if (data instanceof Blob) {
                try {
                    data = JSON.parse(await data.text());
                } catch (e) {
                    // Skip invalid conversion
                }
            }

            if (400 === statusCode && 'invalid_grant' === data.error) {
                message = 'Invalid credentials';
                statusCode = 403;
            } else if (401 === statusCode && 'access_denied' === data.error) {
                message = data.hint;
            } else {
                Object.assign(errors, data);
                message = data.message || message;
            }
        }
    }

    return new HttpClientRequestError(message, statusCode, errors, error);
}
