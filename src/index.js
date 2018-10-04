import Vue from 'vue';
import FaceApi from './components/FaceApi.vue';
import FaceApiWebcam from './components/FaceApiWebcam.vue';
import FaceVerify from './components/FaceVerify.vue';
/*new Vue({
    el: '#faceapi',
    components: {FaceApi},
    template: '<FaceApi/>'
});*/
new Vue({
    el: '#app',
    components: {FaceApiWebcam},
    template: '<FaceApiWebcam/>'
});