const testCode = `import os
import sys

def sayHello():
    message = "Hello, World!
    print message
    retrn Tre

def main():

if __name__ == '__main__':
    man()
    sys.exit()
`;
const testSegments = {
    error: {
        5: [
            { start: 15, end: 29 },
        ],
        6: [
            { start: 11, end: 18 },
        ],
        7: [
            { start: 11, end: 14 },
        ]
    },
    warning: {
        7: [
            { start: 5, end: 10 },
        ],
        12: [
            { start: 5, end: 8 },
        ],
    },
    break: {
        2: [],
    },
    foldedAreas: {
        9: [],
    },
}

export { testCode, testSegments };
