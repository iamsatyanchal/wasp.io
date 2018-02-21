export const logUtils = {
    logMessage: (message: string, color: string = 'red') => {
        if (console && console.log) {
            console.log('%c' + message, 'color:' + color);
        }
    }
}