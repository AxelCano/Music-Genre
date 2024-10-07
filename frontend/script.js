let mediaRecorder;
let audioChunks = [];
let audioUrl;
let audioElement;
let startTime;
let recordingInterval;

// Function to handle errors
function handleError(error) {
    console.error('Error:', error);
    alert('Something went wrong: ' + error.message);
}

// Check if the browser supports the MediaRecorder API
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support audio recording.');
}

// Audio recording logic
document.getElementById('recordBtn').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        // Start the time counter
        startTime = Date.now();
        document.getElementById('recordTime').innerText = "Recording time: 0s";
        recordingInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById('recordTime').innerText = "Recording time: " + elapsedTime + "s";
        }, 1000);

        mediaRecorder.onstop = () => {
            clearInterval(recordingInterval);  // Corrected the variable name
            document.getElementById('recordTime').innerText = "Recording finished";

            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioUrl = URL.createObjectURL(audioBlob);

            // Enable play button
            document.getElementById('playBtn').disabled = false;
            document.getElementById('classifyRecordingBtn').disabled = false;

            // Attach audio element to play the recorded audio
            if (!audioElement) {
                audioElement = document.createElement('audio');
                audioElement.controls = true;
                document.body.appendChild(audioElement);
            }
            audioElement.src = audioUrl;
        };

        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('classifyRecordingBtn').disabled = true;

    } catch (error) {
        handleError(error);
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
    } else {
        alert('No recording in progress.');
    }
    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
});

// Play recorded audio
document.getElementById('playBtn').addEventListener('click', () => {
    if (audioElement) {
        audioElement.play();
    }
});

// Handle classification of recorded audio
document.getElementById('classifyRecordingBtn').addEventListener('click', async () => {
    // Simulate classification for recorded audio
    setTimeout(() => {
        document.getElementById('genre').innerText = "Pop (Dummy Response)";
    }, 1000);
});
