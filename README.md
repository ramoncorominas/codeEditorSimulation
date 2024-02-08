# Code Editor Simulation with Delayed Audio Cues and Accessibility Alerts

## Running the Demo

Start a web server and load the `index.html` file. It will not run locally due to the use of JavaScript modules and the import/export mechanism. You can also try the [online demo](https://ramoncorominas.com/temp/code-editor/).

The textarea labelled "Code editor" is a simplified simulation of the textarea used by Monaco for screen reader users. It is pre-filled with an example of Python code that includes several "features" such as errors, warnings, breakpoints, or folded areas. It is read-only to prevent changes to the code, which could desynchronize the textarea contents and the hard-coded feature locations, leading to confusion.

The audio cues and accessibility alerts are slightly delayed to allow their cancellation if the user moves to another line or character. This avoids constant repetition of sounds or excessive verbosity of text alerts.

## Features

1. Different types of notifications:
   a) Line notifications: Whenever the user changes the line, the system checks if there are any features on the line and fires the audio cue or accessibility alert that corresponds to the highest priority feature. An error has higher priority than a warning, followed by folded areas or breakpoints.
   b) Inline notifications: If the user moves the cursor within the same line, audio cues or accessibility alerts are only triggered if the current character is within a feature segment. This is also how errors and warnings work now in VSCode. Note that a higher pitch version of the audio is played for inline notifications. This is currently achieved by changing the file, but it could be done using the Web Audio API to avoid creating multiple files. If the feature is related to the whole line, it will only be fired when changing the line. This behavior should probably be configurable with optional longer delays (see next point).
2. Separate delays for audio cues and accessibility alerts: Audio cues can play almost immediately without causing excessive disturbance, but text alerts need longer delays, especially when the user is typing or moving with arrow keys within a block that includes a special feature.
3. Several levels of importance, which lead to shorter or longer delays to avoid excessive verbosity/sounds, depending on the type of feature. An error will have shorter delays than a breakpoint, for example. This could also be used to preserve the full-line notifications (breakpoints, folded areas...), but with much longer delays.

## Known Issues

1. When changing from one line to another, if the caret position is within a feature segment, inline notifications now take precedence over line notifications, so other features on the same line will not be announced.
2. When moving focus outside the textarea and returning back to it, if the caret position is inside a full-line feature, the presence of this full-line feature is not announced. This is because, for the moment, these notifications are only fired when the line number changes.