import {ArcRotateCamera, AssetsManager, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

let engine;
let canvas;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    let scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener("resize", function() {
        engine.resize();
    });
}

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine);

    var camera = new ArcRotateCamera("camera", 0, 1, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape.
    var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    const groundMaterial = new StandardMaterial("Ground Material", scene);
    groundMaterial.diffuseColor = Color3.Red();
    let groundTexture = new Texture("path/to/checkerboard_basecolor.png", scene);
    groundMaterial.diffuseTexture = groundTexture; 
    ground.material = groundMaterial;

    var assetsManager = new AssetsManager(scene);
    var meshTask = assetsManager.addMeshTask("yeti task", "", "path/to/meshes/", "yeti.babylon");
    meshTask.onSuccess = function (task) {
        task.loadedMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
    };
    assetsManager.load();

    return scene;
};
