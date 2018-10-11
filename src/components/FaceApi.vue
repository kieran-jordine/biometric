<!-- <style src="../assets/w3.css"></style> -->

<template>
    <div class="w3-row w3-border-amber">
        <button ref="without" disabled="true" v-on:click="ssd">Without Landmarks</button>
        <img ref="processing" alt="processing" src="../../node_modules/material-design-icons/navigation/1x_web/ic_refresh_black_24dp.png" 
            class="spin" style="display:inline-block;vertical-align:middle" />
        <button ref="with" disabled="true" v-on:click="allFaceApi()">With Landmarks</button><br>
        <input ref="imageFile" type="file" accept="image/*" v-on:change="readUrl()" style="margin:7px"/>
        <div style="position:relative">
            <img ref="image" src="../../src/faceapi/images/pose2.jpg" alt="pose1" />
            <canvas ref="canvas" style="position:absolute;top:0px;left:0px;"></canvas>
        </div>        
    </div>
</template>

<script>
import * as face from 'face-api.js';
import * as lib from '../mylibrary1.js';
export default {
    name: "FaceApi",
    data: function() {
        return {
        };
    },
    methods: {
        ssd: async function() {
            console.clear();
            this.$refs.processing.style.display = 'inline-block';
            this.$refs.without.disabled = true;
            this.$refs.with.disabled = true;
            let image = this.$refs.image;
            let canvas = this.$refs.canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').clearRect(0, 0, image.width, image.height);
            const minConfidence = 0.8, maxResults = 10;
            const detections = await face.ssdMobilenetv1(image);//, minConfidence, maxResults);
            const detectionsForSize = detections.map(det => det.forSize(image.width, image.height));
            face.drawDetection(canvas, detectionsForSize, {withScore: false});
            //const landmarks = await face.detectLandmarks(image);            
            //const landmarksForSize = landmarks.forSize(image.width, image.height);
            //face.drawLandmarks(canvas, landmarksForSize, {drawLines: true});
            this.$refs.processing.style.display = 'none';
            this.$refs.without.disabled = false;
            this.$refs.with.disabled = false;
        },
        allFaceApi: async function() {
            console.clear();
            this.$refs.processing.style.display = 'inline-block';
            this.$refs.without.disabled = true;
            this.$refs.with.disabled = true;
            let image = this.$refs.image;
            let canvas = this.$refs.canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').clearRect(0, 0, image.width, image.height);
            const minConfidence = 0.8, maxResults = 10;
            const fullFaceDesc = await face.allFacesSsdMobilenetv1(image, minConfidence);
            fullFaceDesc.forEach((fd, i) => {
                const descriptor = fd.descriptor;
                face.drawDetection(canvas, fd.detection, {withScore: false});
                face.drawLandmarks(canvas, fd.landmarks, {drawLines: true});
            });
            this.$refs.processing.style.display = 'none';
            this.$refs.without.disabled = false;
            this.$refs.with.disabled = false;
        },
        readUrl: async function() {
            console.clear();
            const processing = this.$refs.processing;
            const without = this.$refs.without;
            const withh = this.$refs.with;
            processing.style.display = 'inline-block';
            without.disabled = true;
            withh.disabled = true;
            const image = this.$refs.image;
            const canvas = this.$refs.canvas;
            if (this.$refs.imageFile.files.length == 1) {
                var reader = new FileReader();
                reader.onload = async function (e) {
                    image.setAttribute('src', e.target.result);                    
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
                    processing.style.display = 'none';
                    without.disabled = false;
                    withh.disabled = false;
                };
                reader.readAsDataURL(this.$refs.imageFile.files[0]);
            }
        }
    },
    created: async function() {
        await face.loadSsdMobilenetv1Model('../../faceapi/weights/ssd_mobilenetv1_model-weights_manifest.json');
        await face.loadFaceLandmarkModel('../../faceapi/weights/face_landmark_68_model-weights_manifest.json');
        await face.loadFaceRecognitionModel('../../faceapi/weights/face_recognition_model-weights_manifest.json');
        this.$refs.without.disabled = false;
        this.$refs.with.disabled = false;
        this.$refs.processing.style.display = 'none';
        //console.log(lib.func2(3));
    }
};
</script>

<style>
button {border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;
text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;
white-space:nowrap;border:1px solid #cccccc;border-radius:3px}
button:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)}
button:disabled{cursor:not-allowed;opacity:0.3}
.spin{animation:w3-spin 2s infinite linear}@keyframes w3-spin{0%{transform:rotate(0deg)}100%{transform:rotate(359deg)}}
</style>