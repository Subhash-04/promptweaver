// ===== THREE.JS SPACE PARTICLES SYSTEM =====

// Global variables
let scene, camera, renderer, particles, secondaryParticles;
let particleGeometry, particleMaterial;
let animationId;

// Particle system configuration  
const PARTICLE_COUNT = 4000; // Increased to 4000 for ultimate effect
const PARTICLE_SPREAD = 4000;
const SECONDARY_COUNT = 1000; // More secondary particles

// Initialize the space particles system
function initSpaceParticles() {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    3000
  );
  camera.position.z = 1000;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Add renderer to DOM
  const container = document.getElementById('space-particles');
  container.appendChild(renderer.domElement);
  
  // Create particles
  createParticleSystem();
  
  // Create additional particle layers for depth
  createSecondaryParticles();
  
  // Start animation loop
  animate();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
}

// Create the particle system
function createParticleSystem() {
  particleGeometry = new THREE.BufferGeometry();
  
  // Create particle positions
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  
  // Enhanced magical color palette
  const colorPalette = [
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0xff0080), // Magenta
    new THREE.Color(0x43e7ad), // Mint
    new THREE.Color(0xffd700), // Gold
    new THREE.Color(0x8a2be2), // Blue Violet
    new THREE.Color(0xffffff), // White
    new THREE.Color(0xff69b4), // Hot Pink
    new THREE.Color(0x00ced1), // Dark Turquoise
    new THREE.Color(0x9932cc), // Dark Orchid
    new THREE.Color(0x00ff7f), // Spring Green
    new THREE.Color(0xff1493), // Deep Pink
    new THREE.Color(0x7fff00), // Chartreuse
    new THREE.Color(0xff4500), // Orange Red
    new THREE.Color(0x9370db), // Medium Purple
    new THREE.Color(0x00bfff), // Deep Sky Blue
    new THREE.Color(0xffa500)  // Orange
  ];
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    
    // Random positions in 3D space
    positions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    positions[i3 + 1] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    positions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    
    // Random velocities for floating motion with more variety
    velocities[i3] = (Math.random() - 0.5) * 0.8;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.8;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.4;
    
    // Random colors from magical palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Random sizes with even more variety
    const sizeType = Math.random();
    if (sizeType < 0.6) {
      sizes[i] = Math.random() * 6 + 1; // Small particles (60%)
    } else if (sizeType < 0.9) {
      sizes[i] = Math.random() * 8 + 6; // Medium particles (30%)
    } else {
      sizes[i] = Math.random() * 10 + 14; // Large particles (10%)
    }
  }
  
  // Set geometry attributes
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  
  // Create particle material with custom shader
  particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      pointTexture: { value: createParticleTexture() }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 velocity;
      uniform float time;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        
        // Enhanced floating animation with more movement
        vec3 pos = position;
        pos.x += sin(time * 0.001 + position.y * 0.01) * 25.0;
        pos.y += cos(time * 0.0008 + position.x * 0.01) * 20.0;
        pos.z += sin(time * 0.0012 + position.x * 0.005) * 15.0;
        
        // Add secondary wave motion for more organic movement
        pos.x += cos(time * 0.0005 + position.z * 0.008) * 10.0;
        pos.y += sin(time * 0.0007 + position.z * 0.006) * 8.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      
      void main() {
        vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
        
        // Add magical glow effect
        float distance = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, distance);
        alpha *= textureColor.a;
        
        // Enhanced sparkle effect
        float sparkle = sin(gl_FragCoord.x * 0.1) * sin(gl_FragCoord.y * 0.1);
        alpha += sparkle * 0.15;
        
        // Add twinkling effect
        float twinkle = sin(gl_FragCoord.x * 0.05 + gl_FragCoord.y * 0.05) * 0.5 + 0.5;
        alpha *= (0.7 + twinkle * 0.3);
        
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });
  
  // Create particle system
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

// Create particle texture
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Create additional particle layer for enhanced depth
function createSecondaryParticles() {
  const secondaryGeometry = new THREE.BufferGeometry();
  const SECONDARY_COUNT = 1000;
  
  // Create smaller, dimmer particles for background depth
  const positions = new Float32Array(SECONDARY_COUNT * 3);
  const colors = new Float32Array(SECONDARY_COUNT * 3);
  const sizes = new Float32Array(SECONDARY_COUNT);
  
  for (let i = 0; i < SECONDARY_COUNT; i++) {
    const i3 = i * 3;
    
    // Positions further back
    positions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD * 1.5;
    positions[i3 + 1] = (Math.random() - 0.5) * PARTICLE_SPREAD * 1.5;
    positions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD * 1.5 - 500;
    
    // Dimmer colors
    const color = new THREE.Color(0xffffff);
    colors[i3] = color.r * 0.3;
    colors[i3 + 1] = color.g * 0.3;
    colors[i3 + 2] = color.b * 0.3;
    
    // Smaller sizes
    sizes[i] = Math.random() * 3 + 0.5;
  }
  
  secondaryGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  secondaryGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  secondaryGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const secondaryMaterial = new THREE.PointsMaterial({
    size: 2,
    transparent: true,
    opacity: 0.4,
    vertexColors: true,
    blending: THREE.AdditiveBlending
  });
  
  secondaryParticles = new THREE.Points(secondaryGeometry, secondaryMaterial);
  scene.add(secondaryParticles);
}

// Animation loop
function animate() {
  animationId = requestAnimationFrame(animate);
  
  const time = Date.now();
  
  // Update particle material time uniform
  if (particleMaterial) {
    particleMaterial.uniforms.time.value = time;
  }
  
  // Rotate particle system slowly with slight variation
  if (particles) {
    particles.rotation.x += 0.0007;
    particles.rotation.y += 0.001;
    particles.rotation.z += 0.0003;
  }
  
  // Rotate secondary particles at different speed for depth effect
  if (secondaryParticles) {
    secondaryParticles.rotation.x += 0.0003;
    secondaryParticles.rotation.y += 0.0005;
    secondaryParticles.rotation.z += 0.0002;
  }
  
  // Add enhanced camera movement for depth
  camera.position.x = Math.sin(time * 0.0002) * 120;
  camera.position.y = Math.cos(time * 0.0003) * 60;
  camera.position.z = 1000 + Math.sin(time * 0.0001) * 50; // Add z-axis movement
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse interaction
function addMouseInteraction() {
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
    
    // Slightly move camera based on mouse position
    if (camera) {
      camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05;
    }
  });
}

// Cleanup function
function cleanupSpaceParticles() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (renderer) {
    const container = document.getElementById('space-particles');
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  }
  
  if (particleGeometry) {
    particleGeometry.dispose();
  }
  
  if (particleMaterial) {
    particleMaterial.dispose();
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure video background loads first
  setTimeout(() => {
    initSpaceParticles();
    addMouseInteraction();
  }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupSpaceParticles);

// Export for potential use in other scripts
window.SpaceParticles = {
  init: initSpaceParticles,
  cleanup: cleanupSpaceParticles
}; 