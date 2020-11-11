/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BatchRequestConfig} from '@klipper/sdk/requests/BatchRequestConfig';
import {CommonRequestConfig} from '@klipper/sdk/requests/CommonRequestConfig';
import {DeleteRequestConfig} from '@klipper/sdk/requests/DeleteRequestConfig';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {MetadataRequestConfig} from '@klipper/sdk/requests/MetadataRequestConfig';
import {RequestConfig} from '@klipper/sdk/requests/RequestConfig';
import {SearchRequestConfig} from '@klipper/sdk/requests/SearchRequestConfig';
import {AxiosRequestConfig} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type RequestConfigType = AxiosRequestConfig|CommonRequestConfig|RequestConfig|ListRequestConfig|DeleteRequestConfig|BatchRequestConfig|SearchRequestConfig|MetadataRequestConfig;
