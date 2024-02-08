import { Notifier } from './Notifier.js';

class CodeEditor {
    textarea = null;
    featureSegments = {};

    currentLine;
    currentColumn;
    currentLineFeatures = [];
    currentCharFeatures = [];

    #lastLine = -1;
    #notifier = new Notifier();
    #onUpdateCaretPosition = () => {
        // Always cancel any pending notifications to avoid repetitions
        this.#notifier.cancelPendingAudioCue();
        this.#notifier.cancelPendingAccessibilityAlert();

        if (document.activeElement !== this.textarea) {
            // The textarea isn't focused, so do nothing and exit
            return;
        }

        this.#updateCurrentPosition();
        this.#updateCurrentLineFeatures();
        if (this.currentLineFeatures.length == 0) {
            // The line doesn't have any special features, so just update lastLine and exit
            this.#lastLine = this.currentLine;
            return;
        }

        // Only perform line notifications if we are changing the line
        if (this.currentLine !== this.#lastLine) {
            this.#lastLine = this.currentLine;
            this.#notifier.playAudioCue(this.currentLineFeatures);
            this.#notifier.accessibilityAlert(this.currentLineFeatures)
        }

        this.#updateCurrentCharFeatures();
        if (this.currentCharFeatures.length > 0) {
            this.#notifier.playAudioCue(this.currentCharFeatures, 'inline');
            this.#notifier.accessibilityAlert(this.currentCharFeatures, 'inline')
        }
    }

    constructor(id) {
        const element = document.getElementById(id);
        if (element && element.tagName === 'TEXTAREA') {
            this.textarea = element;
        } else {
            throw new Error(`Element with id "${id}" is not a textarea`);
        }
        this.textarea.addEventListener('focus', () => { this.#lastLine = -1; });
        this.textarea.addEventListener('input', this.#onUpdateCaretPosition);
        this.textarea.addEventListener('keyup', this.#onUpdateCaretPosition);
        this.textarea.addEventListener('mouseup', this.#onUpdateCaretPosition);
    }

    setContent(content) {
        this.textarea.value = content;
    }
    setFeatureSegments(segmentsObj) {
        this.featureSegments = segmentsObj;
    }

    #updateCurrentPosition() {
        const caretOffset = this.textarea.selectionStart;
        const charsBeforeCaret = this.textarea.value.substring(0, caretOffset);
        const lineSegmentsBeforeCaret = charsBeforeCaret.split('\n');

        this.currentLine = lineSegmentsBeforeCaret.length;
        this.currentColumn = lineSegmentsBeforeCaret.pop().length + 1;
        //this.currentColumn = lineSegmentsBeforeCaret[lineSegmentsBeforeCaret.length - 1].length + 1;
    }
    #updateCurrentLineFeatures() {
        let features = [];
        for (let feature in this.featureSegments) {
            if (this.featureSegments[feature].hasOwnProperty(this.currentLine)) {
                features.push(feature);
            }
        }
        this.currentLineFeatures = features;
    }
    #updateCurrentCharFeatures() {
        //this.#updateCurrentLineFeatures();
        if (this.currentLineFeatures.length === 0) {
            // The caret is on a line that doesn't have any features, so there's no need to search for features at the current caret position
            return [];
        }

        let features = [];
        for (let feature of this.currentLineFeatures) {
            let segments = this.featureSegments[feature][this.currentLine];
            for (let segment of segments) {
                if (this.currentColumn >= segment.start && this.currentColumn <= segment.end) {
                    features.push(feature);
                    break;
                }
            }
        }
        this.currentCharFeatures = features;
    }

}

export { CodeEditor };

