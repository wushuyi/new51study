export const isBrowser = typeof window !== 'undefined';

export const px2rem = function (px, designWidth = 414) {
    return (parseInt(px, 10) * 320 / designWidth / 20).toFixed(8) + 'rem';
};

export const sleep = (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
};