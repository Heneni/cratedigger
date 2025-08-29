import * as THREE from 'three';
import Papa from 'papaparse';

// Scene variables
let scene, camera, renderer, controls;
let records = [];
let selectedRecord = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// DOM elements
const loadingElement = document.getElementById('loading');
const infoPanelElement = document.getElementById('info-panel');
const recordTitleElement = document.getElementById('record-title');
const recordArtistElement = document.getElementById('record-artist');
const recordYearElement = document.getElementById('record-year');
const recordGenreElement = document.getElementById('record-genre');
const recordLabelElement = document.getElementById('record-label');

// Camera controls
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Initialize the application
async function init() {
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('canvas-container').appendChild(renderer.domElement);
        
        // Add lights
        setupLighting();
        
        // Load CSV data and create 3D objects
        await loadRecordsFromCSV();
        
        // Add event listeners
        setupEventListeners();
        
        // Hide loading screen
        loadingElement.classList.add('hidden');
        
        // Start animation loop
        animate();
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        loadingElement.innerHTML = '<p>Failed to load records. Please try again.</p>';
    }
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);
    
    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4169e1, 0.3);
    fillLight.position.set(-10, -10, -5);
    scene.add(fillLight);
    
    // Accent light
    const accentLight = new THREE.PointLight(0xff6b6b, 0.5, 50);
    accentLight.position.set(0, 0, 10);
    scene.add(accentLight);
}

async function loadRecordsFromCSV() {
    return new Promise((resolve, reject) => {
        Papa.parse('./cratediggerDB.csv', {
            download: true,
            header: true,
            complete: (results) => {
                try {
                    createRecordObjects(results.data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            error: reject
        });
    });
}

function createRecordObjects(recordsData) {
    const radius = 8;
    const totalRecords = recordsData.length;
    
    recordsData.forEach((record, index) => {
        if (!record.title || !record.artist) return; // Skip invalid records
        
        // Position records in a spiral pattern in 3D space
        const angle = (index / totalRecords) * Math.PI * 4; // Multiple rotations
        const height = (index / totalRecords) * 6 - 3; // Spread vertically
        const currentRadius = radius + Math.sin(angle * 2) * 2; // Varying radius
        
        const x = Math.cos(angle) * currentRadius;
        const y = height;
        const z = Math.sin(angle) * currentRadius;
        
        createRecord(record, x, y, z, index);
    });
}

function createRecord(recordData, x, y, z, index) {
    // Create record geometry - a cylinder for the vinyl record
    const recordGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32);
    
    // Create record material with a dark color
    const recordMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    
    const recordMesh = new THREE.Mesh(recordGeometry, recordMaterial);
    recordMesh.position.set(x, y, z);
    recordMesh.rotation.x = Math.PI / 2; // Lay flat
    recordMesh.castShadow = true;
    recordMesh.receiveShadow = true;
    
    // Create album cover - a plane with the image texture
    const coverGeometry = new THREE.PlaneGeometry(1.2, 1.2);
    
    // Load texture for album cover
    const textureLoader = new THREE.TextureLoader();
    const coverTexture = textureLoader.load(
        recordData.imageUrl,
        () => {
            // Texture loaded successfully
        },
        undefined,
        () => {
            // Fallback if image fails to load
            console.warn(`Failed to load image for ${recordData.title}`);
        }
    );
    
    const coverMaterial = new THREE.MeshLambertMaterial({ 
        map: coverTexture,
        transparent: true,
        opacity: 0.9
    });
    
    const coverMesh = new THREE.Mesh(coverGeometry, coverMaterial);
    coverMesh.position.set(x, y + 0.1, z); // Slightly above the record
    coverMesh.rotation.x = -Math.PI / 2; // Face up
    coverMesh.castShadow = true;
    
    // Create a group to hold both record and cover
    const recordGroup = new THREE.Group();
    recordGroup.add(recordMesh);
    recordGroup.add(coverMesh);
    recordGroup.userData = recordData;
    recordGroup.userData.index = index;
    
    // Add floating animation
    recordGroup.userData.originalY = y;
    recordGroup.userData.floatOffset = Math.random() * Math.PI * 2;
    
    scene.add(recordGroup);
    records.push(recordGroup);
}

function setupEventListeners() {
    // Mouse move for camera control
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Click for record selection
    renderer.domElement.addEventListener('click', onMouseClick, false);
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Scroll for zoom
    window.addEventListener('wheel', onMouseWheel, false);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
    
    // Update mouse coordinates for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with records
    const intersects = raycaster.intersectObjects(records, true);
    
    if (intersects.length > 0) {
        // Find the parent group (record) of the intersected object
        let clickedRecord = intersects[0].object.parent;
        if (clickedRecord.userData.title) {
            selectRecord(clickedRecord);
        }
    } else {
        // Clicked on empty space, deselect
        deselectRecord();
    }
}

function onMouseWheel(event) {
    // Zoom camera in/out
    const delta = event.deltaY > 0 ? 1.1 : 0.9;
    camera.position.multiplyScalar(delta);
    
    // Limit zoom distance
    const distance = camera.position.length();
    if (distance < 5) {
        camera.position.normalize().multiplyScalar(5);
    } else if (distance > 30) {
        camera.position.normalize().multiplyScalar(30);
    }
}

function selectRecord(record) {
    // Deselect previous record
    if (selectedRecord) {
        deselectRecord();
    }
    
    selectedRecord = record;
    
    // Highlight selected record
    record.children.forEach(child => {
        if (child.material) {
            child.material.opacity = 1.0;
            if (child.material.color) {
                child.material.emissive.setHex(0x333333);
            }
        }
    });
    
    // Update info panel
    updateInfoPanel(record.userData);
    infoPanelElement.classList.remove('hidden');
    
    // Animate camera to focus on selected record
    const targetPosition = record.position.clone();
    targetPosition.z += 5; // Move camera closer to the record
    
    animateCameraTo(targetPosition);
}

function deselectRecord() {
    if (selectedRecord) {
        // Remove highlight
        selectedRecord.children.forEach(child => {
            if (child.material) {
                child.material.opacity = 0.9;
                if (child.material.emissive) {
                    child.material.emissive.setHex(0x000000);
                }
            }
        });
        
        selectedRecord = null;
    }
    
    // Hide info panel
    infoPanelElement.classList.add('hidden');
}

function updateInfoPanel(recordData) {
    recordTitleElement.textContent = recordData.title || 'Unknown Title';
    recordArtistElement.textContent = recordData.artist || 'Unknown Artist';
    recordYearElement.textContent = recordData.year || 'Unknown';
    recordGenreElement.textContent = recordData.genre || 'Unknown';
    recordLabelElement.textContent = recordData.label || 'Unknown Label';
}

function animateCameraTo(targetPosition) {
    const startPosition = camera.position.clone();
    let progress = 0;
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    function updateCameraPosition() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        camera.lookAt(selectedRecord.position);
        
        if (progress < 1) {
            requestAnimationFrame(updateCameraPosition);
        }
    }
    
    updateCameraPosition();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update camera position based on mouse movement
    if (!selectedRecord) {
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
    }
    
    // Animate floating records
    const time = Date.now() * 0.001;
    records.forEach((record) => {
        const floatSpeed = 0.5;
        const floatAmount = 0.2;
        record.position.y = record.userData.originalY + 
            Math.sin(time * floatSpeed + record.userData.floatOffset) * floatAmount;
        
        // Gentle rotation
        record.rotation.y += 0.005;
    });
    
    renderer.render(scene, camera);
}

// Start the application
init();