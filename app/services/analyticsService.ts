import googleAnalytics = require("nativescript-google-analytics");
import {Config} from "../utils/config";

export class AnalyticsService {
    public initialize() {
        let config = new Config();

        googleAnalytics.initialize({
            trackingId: config.GoogleAnalyticsTrackingID_TEST
        });
    }

    public logException(message: string, isFatal: boolean) {
        googleAnalytics.logException({
            description: message,
            fatal: isFatal // If true will be a "Crash" in GA.  False is an "Exception"
        });
    }

    public logView(viewName: string) {
        googleAnalytics.logView(viewName);
    }

    public logEvent(category: string, action: string, label: string, value?: string) {
        googleAnalytics.logEvent({
            action: action,
            category: category,
            label: label,
            value: value // Optional
        });
    }

    public startTimer(timerName: string, category: string, name?: string, label?: string) {
       googleAnalytics.startTimer(timerName, {
            category: category,
            label: label, // Optional
            name: name // Optional
        });
    }

    public stopTimer(timerName: string) {
        googleAnalytics.stopTimer(timerName);
    }

    public dispatch() {
        googleAnalytics.dispatch();
    }
}
