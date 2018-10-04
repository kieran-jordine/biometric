<template>
    <div>
        <button ref="faceRecog" disabled="true" v-on:click="ssd">Loading ...</button>
        <button v-on:click="allFaceApi()">All</button>
        <input ref="imageFile" type="file" accept="image/*" v-on:change="readUrl()"/><br> 
        <img ref="image" src="../../src/faceapi/images/pose2.jpg" alt="pose1" /><br>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import * as face from 'face-api.js';

export default {
    name: "FaceApi",
    data: function() {
        return {
        };
    },
    methods: {
        ssd: async function() {
            console.clear();
            let image = this.$refs.image;
            let canvas = this.$refs.canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            console.log(canvas.width, canvas.height);
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            const minConfidence = 0.8, maxResults = 10;
            const detections = await face.ssdMobilenetv1(image);//, minConfidence, maxResults);
            const detectionsForSize = detections.map(det => det.forSize(image.width, image.height));
            face.drawDetection(canvas, detectionsForSize, {withScore: false});
            //const landmarks = await face.detectLandmarks(image);            
            //const landmarksForSize = landmarks.forSize(image.width, image.height);
            //face.drawLandmarks(canvas, landmarksForSize, {drawLines: true});
            console.log('DONE');
        },
        allFaceApi: async function() {
            console.clear();
            let image = this.$refs.image;
            let canvas = this.$refs.canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            const minConfidence = 0.8, maxResults = 10;
            const fullFaceDesc = await face.allFacesSsdMobilenetv1(image, minConfidence);
            fullFaceDesc.forEach((fd, i) => {
                const descriptor = fd.descriptor;
                face.drawDetection(canvas, fd.detection, {withScore: false});
                face.drawLandmarks(canvas, fd.landmarks, {drawLines: true});
            });
        },
        readUrl: function() {
            const image = this.$refs.image;
            if (this.$refs.imageFile.files.length == 1) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    image.setAttribute('src', e.target.result);
                };
                reader.readAsDataURL(this.$refs.imageFile.files[0]);
            }
        }
    },
    created: async function() {
        await face.loadSsdMobilenetv1Model('../../faceapi/weights/ssd_mobilenetv1_model-weights_manifest.json');
        await face.loadFaceLandmarkModel('../../faceapi/weights/face_landmark_68_model-weights_manifest.json');
        await face.loadFaceRecognitionModel('../../faceapi/weights/face_recognition_model-weights_manifest.json');
        this.$refs.faceRecog.disabled = false;
        this.$refs.faceRecog.innerHTML = "SSD Mobile Net";
    }
};
</script>