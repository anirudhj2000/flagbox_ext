let mediaRecorder: MediaRecorder | undefined;
let recordedChunks: Blob[] = [];

chrome.runtime.onMessage.addListener(
    (message: { command: string, tabId: string, streamId: string }) => {
        try {
            console.log("command", message.command);
            switch (message.command) {
                case 'startRecording':
                    startScreenRecordingAlt(message.streamId);
                    break;
                case 'stopRecording':
                    stopScreenRecording();
                    break;
            }
        } catch (error) {
            console.error("Error in message listener:", error);
        }
        return true; // Allows async response
    }
);



async function startScreenRecordingAlt(streamId: string) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                // @ts-ignore
                mandatory: {
                    chromeMediaSourceId: streamId,
                    chromeMediaSource: "tab",
                },
            },
            audio: {
                // @ts-ignore
                mandatory: {
                    chromeMediaSourceId: streamId,
                    chromeMediaSource: "tab",
                },
            },
        });

        console.log("Capturing stream", stream);

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            saveRecording();
            stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
            console.log("Stream and tracks stopped.");
        };

        mediaRecorder.start();
        console.log("Recording started.");
    } catch (error) {
        console.error("Error capturing screen:", error);
    }
}

async function startScreenRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            saveRecording();
            stream.getTracks().forEach((track) => track.stop());
        };
        mediaRecorder.start();
        window.alert('Recording started.');
    } catch (error) {
        console.error('Error capturing screen:', error);
    }
}

function stopScreenRecording() {
    if (mediaRecorder?.state === "recording") {
        mediaRecorder.stop();
        console.log("Recording stopped.");
        window.alert("Recording stopped.");
    }
}


function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'recording2.webm';
    downloadLink.click();
    recordedChunks = [];
}
