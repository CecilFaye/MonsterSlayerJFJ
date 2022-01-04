/* eslint-disable @typescript-eslint/no-explicit-any */
export const stringCompare = (a: string, b: string): any => {
    if (!a) {
        a = '';
    }
    if (!b) {
        b = '';
    }
    const ax: Array<[number, string]> = [];
    const bx: Array<[number, string]> = [];

    (a as any).replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
        ax.push([$1 || Infinity, $2 || '']);
    });
    (b as any).replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
        bx.push([$1 || Infinity, $2 || '']);
    });

    while (ax.length && bx.length) {
        const an = ax.shift();
        const bn = bx.shift();
        const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) {
            return nn;
        }
    }
    return ax.length - bx.length;
}
