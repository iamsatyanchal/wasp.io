import * as Promise from 'bluebird';

export const isEdge = navigator.userAgent.indexOf('Edge') !== -1 &&
               (
                   !!navigator.msSaveOrOpenBlob ||
                   !!navigator.msSaveBlob
            );
//
export const captureMicrophone = (): Promise<{}> => {
    return new Promise<{}>((resolve, reject) => {
        if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
            console.error('This browser does not supports WebRTC getUserMedia API.');
            return false;
            if (!!navigator.getUserMedia) {
                console.error('This browser seems supporting deprecated getUserMedia API.');
                return false;
            }
        }
        navigator.mediaDevices.getUserMedia({
            audio: isEdge ? true : {
                advanced: [
                    {
                        echoCancelation: true
                    }
                ]
            }
        }).then(function (mic) {
            resolve(mic);
        }).catch(function (error) {
            reject(error);
        });
    });
}