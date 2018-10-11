import Vue from 'vue';
import FaceApi from './components/FaceApi.vue';
import FaceApiWebcam from './components/FaceApiWebcam.vue';
import * as myLib1 from './mylibrary.js';
import * as myLib2 from './mylibrary1.js';
/*
new Vue({
    el: '#app',
    components: {FaceApi},
    template: '<FaceApi/>'
});*/

new Vue({
    el: '#webcam',
    components: {FaceApiWebcam},
    template: '<FaceApiWebcam/>'
});

setTimeout(function() {
    //console.clear();
    //console.log(myLib2);
    //console.log(myLib2.func2(5));
    //console.log(lib1.func2(4));
}, 3000);