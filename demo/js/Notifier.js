const alertLevels = {
    critical: {
        audioCues: {
            lineDelay: 50,
            inlineDelay: 150,
        },
        accessibilityAlerts: {
            lineDelay: 400,
            inlineDelay: 750,
        },
    },
    info: {
        audioCues: {
            lineDelay: 150,
            inlineDelay: 300,
        },
        accessibilityAlerts: {
            lineDelay: 600,
            inlineDelay: 1000,
        },
    },
}
const editorFeatures = {
    error: {
        priorityOrder: 0,
        alertLevel: 'critical',
        text: 'error',
    },
    warning: {
        priorityOrder: 1,
        alertLevel: 'info',
        text: 'warning',
    },
    break: {
        priorityOrder: 2,
        alertLevel: 'info',
        text: 'breakpoint',
    },
    foldedAreas: {
        priorityOrder: 3,
        alertLevel: 'info',
        text: 'folded',
    },
}

class Notifier {

    #audioCuesDirectory = './audiocues';
    #accessibilityAlertsElementId = 'notifier';
    #pendingAudioCue = false;
    #pendingAccessibilityAlert = false;

    #sortFeaturesByPriority(features) {
        return features.sort((a, b) => {
            const priorityA = editorFeatures[a].priorityOrder;
            const priorityB = editorFeatures[b].priorityOrder;
            return priorityA - priorityB;
        });
    }

    playAudioCue(features, type = 'line') {
        this.cancelPendingAudioCue();
        const mainFeature = this.#sortFeaturesByPriority(features)[0];
        const alertLevel = editorFeatures[mainFeature].alertLevel;
        const delay = alertLevels[alertLevel].audioCues[`${type}Delay`];
        this.#pendingAudioCue = setTimeout(() => {
            const audioName = (type == 'inline')? `${mainFeature}-inline` : mainFeature;
            const audioCue = new Audio(`${this.#audioCuesDirectory}/${audioName}.mp3`);
            audioCue.play();
        }, delay);
    }

    cancelPendingAudioCue() {
        if (this.#pendingAudioCue) {
            clearTimeout(this.#pendingAudioCue);
            this.#pendingAudioCue = false;
        }
    }


    accessibilityAlert(features, type = 'line') {
        this.cancelPendingAccessibilityAlert();
        const notifierElement = document.getElementById(this.#accessibilityAlertsElementId);
        const sortedFeatures = this.#sortFeaturesByPriority(features);
        const mainFeature = sortedFeatures[0];
        const alertLevel = editorFeatures[mainFeature].alertLevel;
        const delay = alertLevels[alertLevel].accessibilityAlerts[`${type}Delay`];
        this.#pendingAccessibilityAlert = setTimeout(() => {
            const sortedFeaturesTexts = sortedFeatures.map(feature => editorFeatures[feature].text);
            const message = sortedFeaturesTexts.join(', ');
            notifierElement.textContent = message;
            setTimeout(() => {
                notifierElement.textContent = '';
            }, 1000); // reset live region after 1 second
        }, delay);
    }

    cancelPendingAccessibilityAlert() {
        if (this.#pendingAccessibilityAlert) {
            clearTimeout(this.#pendingAccessibilityAlert);
            this.#pendingAccessibilityAlert = false;
        }
    }

} // class

export { Notifier };