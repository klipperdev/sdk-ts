/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ObjectMetadataResponse {
    name: string;
    plural_name: string;
    label: string;
    sortable: boolean;
    multi_sortable: boolean;
    default_sortable: string[];
    filterable: boolean;
    searchable: boolean;
    translatable: boolean;
    available_contexts: string[];
    field_identifier: string;
    field_label: string;
    editable_permissions: boolean;
    master: boolean;
    available_actions: string[];
}
