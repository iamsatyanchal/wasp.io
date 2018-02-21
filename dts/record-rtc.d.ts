declare function RecordRTC(mediaStream: any): RecordRTC;

interface InternalRecorder {
    getArrayOfBlobs: () => any[];
}
interface RecordRTC {
    startRecording(): void;
    pauseRecording(): void;
    resumeRecording(): void;
    stopRecording(cb: (url: string) => void): void;
    getInternalRecorder: () => InternalRecorder;
    getBlob(): Blob;
    getDataURL(cb: (url: string) => void): void;
    toURL(): string;
}