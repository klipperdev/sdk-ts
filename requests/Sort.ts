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
export class Sort {
    public readonly field: string;

    public readonly direction: string;

    constructor(field: string, direction: string = 'ASC') {
        this.field = field;
        this.direction = 'DESC' === direction ? 'DESC' : 'ASC';
    }

    public toString(): string {
        return this.field + ':' + this.direction;
    }
}
