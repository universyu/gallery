import * as THREE from 'three'

const CAMERA_POSITION = new THREE.Vector3(-1.0, 0.4842909176402553, 4.096946679241262)

export class ThreeDeeRenderer {
    private camera: THREE.PerspectiveCamera
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private resizeObserver: ResizeObserver;
    private galaxyParticles: THREE.Points | null = null;
    private galaxyCenter = new THREE.Vector3(0, 0, 0);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const parent = canvas.parentElement;
        const clientWidth = parent ? parent.clientWidth : canvas.clientWidth;
        const clientHeight = parent ? parent.clientHeight : canvas.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            clientWidth / clientHeight,
            0.1,
            100000
        );
        this.camera.position.copy(CAMERA_POSITION);
        this.camera.lookAt(this.galaxyCenter);
        
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(clientWidth, clientHeight);
        this.createGalaxy();
        
        // 监听父元素的尺寸变化
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                this.onCanvasResize(width, height);
            }
        });

        // 优先监听父元素
        if (parent) {
            this.resizeObserver.observe(parent);
        } else {
            this.resizeObserver.observe(this.canvas);
        }
        
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    private onCanvasResize = (width: number, height: number) => {
        this.renderer.setSize(width, height, true);
        
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    
        this.camera.lookAt(this.galaxyCenter);
        
        this.renderer.render(this.scene, this.camera);
    }

    private render = () => {        
        if (this.galaxyParticles) {
            this.galaxyParticles.rotation.y += 0.005;
        }
        this.camera.lookAt(this.galaxyCenter);
        this.renderer.render(this.scene, this.camera);
    }

    private createGalaxy = (
        parameters = {
            count: 50000,
            size: 0.01,
            radius: 5,
            branches: 5,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: '#ff6030',
            outsideColor: '#1b3984'
        }
    ) => {
        // 清除已有的银河
        if (this.galaxyParticles) {
            this.scene.remove(this.galaxyParticles);
            this.galaxyParticles.geometry.dispose();
            (this.galaxyParticles.material as THREE.Material).dispose();
        }
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // 创建材质
        const material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        // 创建点云
        this.galaxyParticles = new THREE.Points(geometry, material);
        
        // 确保银河位于场景中央
        this.galaxyParticles.position.set(0, 0, 0);
        this.scene.add(this.galaxyParticles);
    }

    public dispose = () => {
        this.resizeObserver.disconnect();        
        if (this.galaxyParticles) {
            this.scene.remove(this.galaxyParticles);
            this.galaxyParticles.geometry.dispose();
            (this.galaxyParticles.material as THREE.Material).dispose();
        }
        
        // 清理渲染器
        this.renderer.dispose();
    }
    
    // 允许外部更新银河参数
    public updateGalaxy = (parameters: any) => {
        this.createGalaxy(parameters);
    }
    
    // 重新设置相机位置，但保持银河在视野中央
    public resetCamera = () => {
        this.camera.position.copy(CAMERA_POSITION);
        this.camera.lookAt(this.galaxyCenter);
    }
}