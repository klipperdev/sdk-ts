/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';
import {CommonRequestConfig} from './CommonRequestConfig';
import {RequestConfig} from './RequestConfig';
import {ListRequestConfig} from './ListRequestConfig';
import {DeleteRequestConfig} from './DeleteRequestConfig';
import {SearchRequestConfig} from './SearchRequestConfig';
import {MetadataRequestConfig} from './MetadataRequestConfig';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type RequestConfigType = AxiosRequestConfig|CommonRequestConfig|RequestConfig|ListRequestConfig|DeleteRequestConfig|SearchRequestConfig|MetadataRequestConfig;
