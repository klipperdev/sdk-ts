/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosError, AxiosResponse} from 'axios';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Errors} from '@klipper/http-client/models/responses/Errors';

/**
 * Create the error for the api.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApiError(error: Error): HttpClientRequestError {
    let message: string = 'Error network';
    let statusCode: number = 0;
    const errors = {errors: []} as Errors;

    if ((error as AxiosError).response && ((error as AxiosError).response as AxiosResponse).status) {
        statusCode = ((error as AxiosError).response as AxiosResponse).status;

        if (((error as AxiosError).response as AxiosResponse).data) {
            const data = ((error as AxiosError).response as AxiosResponse).data;

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
