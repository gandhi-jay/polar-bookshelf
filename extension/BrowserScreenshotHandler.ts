import {Results} from '../web/js/util/Results';
import {Handlers} from './Handlers';
import {webextensions} from './WebExtensions';
import {Canvases} from '../web/js/util/Canvases';
import {ILTRect} from '../web/js/util/rects/ILTRect';
import {Stopwatches} from '../web/js/util/Stopwatches';
import {DataURL} from '../web/js/util/DataURLs';

/**
 * Allows us to take screenshots of the current browser within a chrome
 * extension.
 */
export class BrowserScreenshotHandler {

    public static register() {

        chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

            if (this.isHandled(message)) {

                if (Handlers.isAuthorized(sender)) {

                    const request = <ScreenshotRequest> message;

                    const handleResponse = async () => {

                        const tabImage: DataURL = await this.captureTabImage();

                        console.debug("FIXME: Received raw tab image: ", tabImage);

                        const dataURL
                            = await this.crop(tabImage, request.rect);

                        console.debug("FIXME: Cropped image: ", dataURL);

                        // it takes about 200ms to TAKE a screenshot but only
                        // about 20ms to send it.

                        const result: BrowserScreenshot = {
                            dataURL, type: 'image/png'
                        };

                        sendResponse(Results.of(result));

                    };

                    handleResponse()
                        .catch(err => {
                            console.error("Caught error trying to take screenshot: ", err);
                            sendResponse(Results.ofError(err));
                        });

                    // needed so that we can handle the response async.
                    return true;

                } else {
                    console.debug("Not authorized");
                }

            } else {
                console.debug("Not handled");
            }

            return false;

        });

    }

    private static async toDataURL(data: ArrayBuffer) {

        return await Stopwatches.withStopwatchAsync(() => Canvases.toDataURL(data),
                                                    stopwatch => console.log("toDataURL: " + stopwatch));

    }

    private static async crop(tabImage: DataURL, rect: ILTRect) {

        return await Stopwatches.withStopwatchAsync(() => Canvases.crop(tabImage, rect),
                                                    stopwatch => console.log("crop: " + stopwatch));

    }

    private static async captureTabImage() {
        return await Stopwatches.withStopwatchAsync(() => webextensions.Tabs.captureVisibleTab(),
                                                    stopwatch => console.log("captureVisibleTab: " + stopwatch));
    }

    private static isHandled(message: any) {
        return message && message.type && message.type === 'browser-screenshot';
    }

}

export interface BrowserScreenshot {
    readonly dataURL: string;
    readonly type: 'image/png';
}

interface ScreenshotRequest {
    readonly rect: ILTRect;
}
