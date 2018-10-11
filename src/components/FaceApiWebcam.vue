<template>
    <div>
        <button ref="start" v-on:click="ssdMobilenet()" disabled="true">SSD Mobile</button>
        <button ref="yolo" v-on:click="yolo()" disabled="true">Tiny Yolo</button>
        <button ref="mtcnn" v-on:click="mtcnn()" disabled="true">MTCNN</button>
        <img ref="processing" alt="processing" src="../../node_modules/material-design-icons/navigation/1x_web/ic_refresh_black_24dp.png" 
            class="spin" style="display:inline-block;vertical-align:middle" />
        <button ref="stop" v-on:click="stopStream()" disabled="true">Stop Stream</button>
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
        ssdMobilenet: async function() {
            console.clear();
            const stopp = this.$refs.stop;
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const detectssd = async function() { console.log('detectssd');
                //const minConfidence = 0.5, maxResults = 10;
                const detections = await face.ssdMobilenetv1(video);//, minConfidence, maxResults);
                if (detections) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    const detectionsForSize = detections.map(det => det.forSize(video.width, video.height));
                    face.drawDetection(canvas, detectionsForSize, {withScore: false});                
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }                
                if (!video.paused) {
                    detectssd();
                }
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    stopp.disabled = false;
                    setTimeout(function() {detectssd()}, 1500);
				},
				function (error) {
					console.log(error);
                }
            );
        },
        mtcnn: async function() { 
            //await face.loadMtcnnModel('../../faceapi/weights/');
            console.clear();
            const stopp = this.$refs.stop;
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const detectmtcnn = async function() { console.log('detectmtcnn');              
                const forwardParams = {maxNumScales:10,scaleFactor:0.709,scoreThresholds:[0.6,0.7,0.7],minFaceSize:200,scaleSteps:[0.4, 0.2, 0.1, 0.05]};
                const detections = await face.mtcnn(video, forwardParams); //console.log('detectmtcnn after');
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
                if (!video.paused) {
                    detectmtcnn();
                }
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    stopp.disabled = false;
                    setTimeout(function() {detectmtcnn()}, 1500);
				},
				function (error) {
					console.log(error);
                }
            );
        },
        yolo: async function() {
            //await face.loadMtcnnModel('../../faceapi/weights/');
            console.clear();
            const stopp = this.$refs.stop;
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const detectyolo = async function() { console.log('detectyolo');            
                const forwardParams = {scoreThreshold:0.5,inputSize:'md'};
                const detections = await face.tinyYolov2(video, forwardParams);
                if (detections.length > 0) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    detections.forEach(fd => {
                        face.drawDetection(canvas, fd);
                    });
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
                if (!video.paused) {
                    setTimeout(function() {detectyolo()}, 1000);
                }
            };
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                    stopp.disabled = false;
                    setTimeout(function() {detectyolo()}, 1500);
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
            this.$refs.stop.disabled = true;
        }
    },
    created: async function() {
        await face.loadSsdMobilenetv1Model('../../faceapi/weights/');
        await face.loadMtcnnModel('../../faceapi/weights/');
        await face.loadTinyYolov2Model('../../faceapi/weights/');
        this.$refs.start.disabled = false;
        this.$refs.mtcnn.disabled = false;
        this.$refs.yolo.disabled = false;
        this.$refs.processing.style.display = 'none';
    }
};
</script>