// public/js/network.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class NetworkManager {
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.remotePlayers = new Map();
    }

    init() {
        // Load socket.io script dynamically or import via CDN in html
        this.socket = io();

        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (id !== this.socket.id) {
                    this.addRemotePlayer(players[id]);
                }
            });
        });

        this.socket.on('playerJoined', (playerData) => {
            this.addRemotePlayer(playerData);
        });

        this.socket.on('playerMoved', (playerData) => {
            this.updateRemotePlayer(playerData);
        });

        this.socket.on('playerLeft', (id) => {
            this.removeRemotePlayer(id);
        });
    }

    addRemotePlayer(data) {
        // Create realistic remote player mesh representation
        const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.3 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.position.set(data.position.x, data.position.y, data.position.z);
        this.game.scene.add(mesh);

        this.remotePlayers.set(data.id, mesh);
    }

    updateRemotePlayer(data) {
        const mesh = this.remotePlayers.get(data.id);
        if (mesh) {
            mesh.position.set(data.position.x, data.position.y, data.position.z);
            mesh.rotation.y = data.rotation.y;
        }
    }

    removeRemotePlayer(id) {
        const mesh = this.remotePlayers.get(id);
        if (mesh) {
            this.game.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.remotePlayers.delete(id);
        }
    }

    sendTransform(position, rotation) {
        if (this.socket) {
            this.socket.emit('playerMove', {
                position: { x: position.x, y: position.y, z: position.z },
                rotation: { y: rotation.y }
            });
        }
    }
}
