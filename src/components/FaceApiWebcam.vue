<template>
    <div>
        <button ref="start" v-on:click="start()" disabled="true">Loading ...</button>
        <button ref="mtcnn" v-on:click="mtcnn()" disabled="true">MTCNN</button>
        <button ref="yolo" v-on:click="yolo()" disabled="true">Tiny Yolo</button>
        <button ref="stop" v-on:click="stopStream()">Stop Stream</button>
        <div style="position:relative">
            <video ref="video" width="640" height="480"></video><br>
            <canvas ref="canvas" style="position:absolute;top:0px;left:0px;" width="640" height="480"></canvas>
        </div>
    </div>
</template>

<script>
import * as face from 'face-api.js';
export default {
    name: "FaceApiWebcam",
    data: function() {
        return {
        };
    },
    methods: {
        start: async function() {
            console.clear();
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const detect = async function() {
                //const minConfidence = 0.5, maxResults = 10;
                const detections = await face.ssdMobilenetv1(video);//, minConfidence, maxResults);
                if (detections) {
                    console.log(detections);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    const detectionsForSize = detections.map(det => det.forSize(video.width, video.height));
                    face.drawDetection(canvas, detectionsForSize, {withScore: false});                
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
                detect();
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    setTimeout(function() {detect()}, 2000);
				},
				function (error) {
					console.log(error);
                }
            );
        },
        mtcnn: async function() {
            //await face.loadMtcnnModel('../../faceapi/weights/');
            console.clear();
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const detect = async function() {                
                const forwardParams = {maxNumScales:10,scaleFactor:0.709,scoreThresholds:[0.6,0.7,0.7],minFaceSize:200,scaleSteps:[0.4, 0.2, 0.1, 0.05]};
                const detections = await face.mtcnn(video, forwardParams);
                if (detections.length > 0) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    detections.forEach(fd => {
                        if (fd) {
                            face.drawDetection(canvas, fd.faceDetection);
                            face.drawLandmarks(canvas, fd.faceLandmarks);
                        }
                    });
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
                detect();
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    setTimeout(function() {detect()}, 1000);
				},
				function (error) {
					console.log(error);
                }
            );
        },
        yolo: async function() {
            //await face.loadMtcnnModel('../../faceapi/weights/');
            console.clear();
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            let keepGoing = true;
            video.addEventListener('playing', () => { console.log('video is playing'); });
            video.addEventListener('play', () => { console.log('play'); });
            video.addEventListener('pause', () => { console.log('pause'); keepGoing = false; });
            const detect = async function() {                
                const forwardParams = {scoreThreshold:0.5,inputSize:'md'};
                const detections = await face.tinyYolov2(video, forwardParams);
                console.log(detections);
                if (detections.length > 0) {
                    console.log(detections);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    detections.forEach(fd => {
                        face.drawDetection(canvas, fd);
                    });
                    if (keepGoing) {
                        setTimeout(function() {
                            console.log('keep going');   
                            detect();                         
                        }, 2000);
                    }
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    if (keepGoing) {
                        detect();
                    }
                }
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    setTimeout(function() {detect()}, 1000);
				},
				function (error) {
					console.log(error);
                }
            );
        },
        stopStream: function() {
            const video = this.$refs.video; 
            video.pause();
			video.srcObject.getVideoTracks().forEach(track => track.stop());
			video.srcObject.getAudioTracks().forEach(track => track.stop());
        }
    },
    created: async function() {
        await face.loadSsdMobilenetv1Model('../../faceapi/weights/');
        await face.loadMtcnnModel('../../faceapi/weights/');
        await face.loadTinyYolov2Model('../../faceapi/weights/');
        this.$refs.start.disabled = false;
        this.$refs.mtcnn.disabled = false;
        this.$refs.yolo.disabled = false;
        this.$refs.start.innerHTML = 'SSD Mobilenet';
    }
};
</script>