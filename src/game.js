import { FreeCamera, HemisphericLight, MeshBuilder, Scalar, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import meshUrl from "../assets/models/HVGirl.glb";

const TRACK_WIDHT = 6;
const TRACK_HEIGHT = 0.1;
const TRACK_DEPTH = 3;
const BORDER_HEIGHT = 0.5;
const NB_TRACKS = 50;
const NB_OBSTACLES = 5;
const SPAWN_POS_Z = (TRACK_DEPTH * NB_TRACKS) - 1;

class Game {

    engine;
    canvas;
    scene;

    obstacles = [];

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }

    init() {
        this.createScene();
        Inspector.Show(this.scene, {});

    }

    start() {
        this.engine.runRenderLoop(() => {
            let delta = this.engine.getDeltaTime() / 1000.0;

            for (let i = 0; i < this.obstacles.length; i++) {
                let obstacle = this.obstacles[i];
                obstacle.position.z += (50 * delta);

                if (obstacle.position.z >= 1) {
                    let x = Scalar.RandomRange(-TRACK_WIDHT / 2, TRACK_WIDHT / 2); 
                    let z = Scalar.RandomRange(-SPAWN_POS_Z, -(SPAWN_POS_Z-50));
                    obstacle.position.set(x, 0.5, z);
                }
            }
            this.scene.render();
        });
    }

    update() {

    }

    createScene() {
        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);

        // This creates and positions a free camera (non-mesh)
        this.camera = new FreeCamera("camera1", new Vector3(0, 3.8, 5), this.scene);

        // This targets the camera to scene origin
        this.camera.setTarget(new Vector3(0, 3, 3));

        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'ground' shape.
        //var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this.scene);


        SceneLoader.ImportMesh("", "", meshUrl, this.scene, (newMeshes) => {
            // Set the target of the camera to the first imported mesh
            newMeshes[0].name = "girlCharacter";
            newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
            this.camera.target = newMeshes[0];
        });

        let mainTrack = MeshBuilder.CreateBox("trackMiddle", { width: TRACK_WIDHT, height: TRACK_HEIGHT, depth: TRACK_DEPTH });

        let leftBorder = MeshBuilder.CreateBox("leftBorder", { width: TRACK_HEIGHT, height: BORDER_HEIGHT, depth: TRACK_DEPTH });
        leftBorder.position.set(-(TRACK_WIDHT / 2), (BORDER_HEIGHT / 2) - (TRACK_HEIGHT / 2), 0);
        leftBorder.parent = mainTrack;

        let rightBorder = MeshBuilder.CreateBox("rightBorder", { width: TRACK_HEIGHT, height: BORDER_HEIGHT, depth: TRACK_DEPTH });
        rightBorder.position.set(TRACK_WIDHT / 2, (BORDER_HEIGHT / 2) - (TRACK_HEIGHT / 2), 0);
        rightBorder.parent = mainTrack;

        for (let i = 1; i <= NB_TRACKS; i++) {
            let newTrack = mainTrack.clone("track2");
            newTrack.position.z = -TRACK_DEPTH * i;
        }

        let obstacleModele = MeshBuilder.CreateCapsule("obstacle", this.scene);
        for (let i = 0; i < NB_OBSTACLES; i++) {
            let obstacle = obstacleModele.clone("obstacle" + i);
            let x = Scalar.RandomRange(-TRACK_WIDHT / 2, TRACK_WIDHT / 2); 
            let z = Scalar.RandomRange(-SPAWN_POS_Z, -(SPAWN_POS_Z-50));
            obstacle.position.set(x, 0.5, z);
            this.obstacles.push(obstacle);
        }
        obstacleModele.dispose();
    }

}

export default Game;