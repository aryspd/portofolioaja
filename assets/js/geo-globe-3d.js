/**
 * INDONESIA GEO VIEWER — 3D Interactive WebGL Globe Visualizer
 * Built with Three.js for Arya Sukma Putra Dwika's Portfolio
 * Features:
 * - 3D Earth with Dot-Matrix Continents & Highlighted Nusantara Archipelago
 * - Glowing Atmospheric Fresnel Haze
 * - Pulsing GIS Beacons (IKN Nusantara, Pontianak Khatulistiwa, Jakarta, Jayapura, Medan)
 * - 3D Geodesic Telemetry Arcs with Travelling Energy Pulses
 * - Orbital Satellites (NASA VIIRS & Copernicus Sentinel)
 * - Interactive Mouse/Touch Orbit Controls & Dynamic Telemetry Readout
 */

import * as THREE from "../vendor/three.module.js";

class NusantaraGlobe3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globeGroup = null;
    this.arcsGroup = null;
    this.beaconsGroup = null;
    this.satellites = [];
    this.pulses = [];

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.15, y: -2.05 }; // Default centered on Indonesia
    this.currentRotation = { x: 0.15, y: -2.05 };
    this.autoRotate = true;
    this.autoRotateSpeed = 0.0018;

    this.GLOBE_RADIUS = 100;
    this.animationFrameId = null;

    this.init();
  }

  // Convert Latitude / Longitude to 3D Cartesian coordinates
  latLonToVector3(lat, lon, radius, alt = 0) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = radius + alt;

    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.camera.position.set(0, 30, 260);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // 3. Globe Root Group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0e2439, 1.8);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x65d9ed, 2.5);
    sunLight.position.set(300, 200, 200);
    this.scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x1e3a8a, 1.8);
    backLight.position.set(-300, -100, -200);
    this.scene.add(backLight);

    // 5. Construct Visual Layers
    this.createDarkCore();
    this.createAtmosphereHalo();
    this.createContinentParticles();
    this.createNusantaraHighlight();
    this.createTelemetryArcs();
    this.createGISBeacons();
    this.createOrbitingSatellites();
    this.createStarField();

    // 6. Interaction Handlers
    this.setupEvents();

    // 7. Start Render Loop
    this.animate();
  }

  createDarkCore() {
    // Dark oceanic core sphere
    const geometry = new THREE.SphereGeometry(this.GLOBE_RADIUS * 0.99, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x06101d,
      emissive: 0x040912,
      shininess: 25,
      specular: 0x183b56,
      transparent: true,
      opacity: 0.96,
    });
    const core = new THREE.Mesh(geometry, material);
    this.globeGroup.add(core);

    // Subtle meridian wireframe
    const wireGeo = new THREE.SphereGeometry(this.GLOBE_RADIUS * 0.995, 32, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1c3b5a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    this.globeGroup.add(wireframe);

    // Equator ring (highlighting Pontianak on line 0°)
    const equatorGeo = new THREE.RingGeometry(this.GLOBE_RADIUS * 1.002, this.GLOBE_RADIUS * 1.006, 128);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x65d9ed,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    this.globeGroup.add(equator);
  }

  createAtmosphereHalo() {
    // Custom atmosphere Fresnel shader
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(0.7 - dot(vNormal, viewDir), 2.2);
        gl_FragColor = vec4(0.39, 0.85, 0.93, 1.0) * intensity * 0.85;
      }
    `;

    const atmosphereGeo = new THREE.SphereGeometry(this.GLOBE_RADIUS * 1.15, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    this.scene.add(atmosphere);
  }

  // Generate continent dot-matrix points
  createContinentParticles() {
    const points = [];
    const colors = [];
    const globalCount = 3800;

    // Continent approximate bounding regions [minLat, maxLat, minLon, maxLon]
    const landRegions = [
      // Southeast Asia / Asia
      { minLat: 8, maxLat: 65, minLon: 60, maxLon: 145 },
      // Europe
      { minLat: 35, maxLat: 70, minLon: -10, maxLon: 45 },
      // Africa
      { minLat: -35, maxLat: 37, minLon: -18, maxLon: 50 },
      // North America
      { minLat: 15, maxLat: 72, minLon: -168, maxLon: -55 },
      // South America
      { minLat: -55, maxLat: 12, minLon: -82, maxLon: -34 },
      // Australia
      { minLat: -42, maxLat: -11, minLon: 112, maxLon: 154 },
      // Middle East / India
      { minLat: 8, maxLat: 38, minLon: 40, maxLon: 90 },
      // Japan / East Asia
      { minLat: 28, maxLat: 46, minLon: 125, maxLon: 146 },
    ];

    for (let i = 0; i < globalCount; i++) {
      const region = landRegions[Math.floor(Math.random() * landRegions.length)];
      // Add natural noise/distribution
      const lat = region.minLat + Math.random() * (region.maxLat - region.minLat);
      const lon = region.minLon + Math.random() * (region.maxLon - region.minLon);

      const pos = this.latLonToVector3(lat, lon, this.GLOBE_RADIUS);
      points.push(pos.x, pos.y, pos.z);

      // Slate cyan-blue for world continents
      colors.push(0.22, 0.44, 0.65);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    this.globeGroup.add(particles);
  }

  // Dense, glowing representation of the Indonesian Archipelago
  createNusantaraHighlight() {
    const indonesiaPoints = [];
    const indonesiaColors = [];

    // Detailed coordinate clusters for Nusantara islands
    const islands = [
      // Sumatra
      { minLat: -5.8, maxLat: 5.5, minLon: 95.2, maxLon: 106.0, count: 500 },
      // Java
      { minLat: -8.8, maxLat: -6.0, minLon: 105.2, maxLon: 114.6, count: 450 },
      // Kalimantan (Borneo - Indonesia)
      { minLat: -4.3, maxLat: 4.2, minLon: 108.8, maxLon: 118.8, count: 650 },
      // Sulawesi
      { minLat: -5.6, maxLat: 1.8, minLon: 118.8, maxLon: 125.2, count: 420 },
      // Papua
      { minLat: -9.1, maxLat: -0.2, minLon: 130.5, maxLon: 141.0, count: 600 },
      // Bali & Nusa Tenggara
      { minLat: -10.5, maxLat: -8.1, minLon: 114.4, maxLon: 125.1, count: 320 },
      // Maluku
      { minLat: -8.5, maxLat: 2.5, minLon: 125.6, maxLon: 134.8, count: 300 },
    ];

    islands.forEach((isle) => {
      for (let i = 0; i < isle.count; i++) {
        // Skewing for island-like shapes
        const t = Math.random();
        const lat = isle.minLat + t * (isle.maxLat - isle.minLat) + (Math.random() - 0.5) * 0.3;
        const lon = isle.minLon + t * (isle.maxLon - isle.minLon) + (Math.random() - 0.5) * 0.8;

        const pos = this.latLonToVector3(lat, lon, this.GLOBE_RADIUS * 1.008);
        indonesiaPoints.push(pos.x, pos.y, pos.z);

        // Radiant cyan and emerald neon glow for Nusantara
        const isEmerald = Math.random() > 0.45;
        if (isEmerald) {
          indonesiaColors.push(0.12, 0.95, 0.65); // Emerald GIS green
        } else {
          indonesiaColors.push(0.40, 0.88, 0.98); // Vibrant cyan
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(indonesiaPoints, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(indonesiaColors, 3));

    const material = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    const nusantaraMesh = new THREE.Points(geometry, material);
    this.globeGroup.add(nusantaraMesh);
  }

  // Create pulsing GIS beacons on strategic Indonesian coordinates
  createGISBeacons() {
    this.beaconsGroup = new THREE.Group();
    this.globeGroup.add(this.beaconsGroup);

    const locations = [
      { name: "IKN Nusantara (Kaltim)", lat: -0.9619, lon: 116.7025, color: 0xf59e0b, radius: 4.8 }, // Gold
      { name: "Pontianak (Khatulistiwa)", lat: -0.0263, lon: 109.3425, color: 0x65d9ed, radius: 4.2 }, // Cyan
      { name: "Jakarta (BMKG/BIG)", lat: -6.2088, lon: 106.8456, color: 0x3b82f6, radius: 3.8 }, // Blue
      { name: "Jayapura (Papua)", lat: -2.5337, lon: 140.7181, color: 0x10b981, radius: 3.6 }, // Emerald
      { name: "Medan (Sumut)", lat: 3.5952, lon: 98.6722, color: 0x10b981, radius: 3.6 },
      { name: "Makassar (Sulsel)", lat: -5.1477, lon: 119.4327, color: 0x65d9ed, radius: 3.6 },
    ];

    this.beacons = [];

    locations.forEach((loc) => {
      const pos = this.latLonToVector3(loc.lat, loc.lon, this.GLOBE_RADIUS * 1.012);

      // Central glowing beacon pin
      const pinGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      this.beaconsGroup.add(pin);

      // Animated pulsating radar ring
      const ringGeo = new THREE.RingGeometry(1.2, 2.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0); // Face outward from globe center
      this.beaconsGroup.add(ring);

      this.beacons.push({
        pin,
        ring,
        baseScale: 1,
        loc,
      });
    });
  }

  // 3D Geodesic Curves connecting data nodes
  createTelemetryArcs() {
    this.arcsGroup = new THREE.Group();
    this.globeGroup.add(this.arcsGroup);

    const arcPairs = [
      { from: [-0.0263, 109.3425], to: [-0.9619, 116.7025], color: 0x65d9ed }, // Pontianak -> IKN
      { from: [-6.2088, 106.8456], to: [-0.9619, 116.7025], color: 0x38bdf8 }, // Jakarta -> IKN
      { from: [-0.9619, 116.7025], to: [-2.5337, 140.7181], color: 0x10b981 }, // IKN -> Jayapura
      { from: [3.5952, 98.6722], to: [-0.0263, 109.3425], color: 0x65d9ed }, // Medan -> Pontianak
      { from: [-6.2088, 106.8456], to: [-5.1477, 119.4327], color: 0xf59e0b }, // Jakarta -> Makassar
    ];

    arcPairs.forEach((pair) => {
      const v1 = this.latLonToVector3(pair.from[0], pair.from[1], this.GLOBE_RADIUS);
      const v2 = this.latLonToVector3(pair.to[0], pair.to[1], this.GLOBE_RADIUS);

      // Arc midpoint lifted above globe
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const maxAltitude = this.GLOBE_RADIUS + distance * 0.35;
      mid.setLength(maxAltitude);

      // Quadratic Bezier curve
      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const curvePoints = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const curveMat = new THREE.LineBasicMaterial({
        color: pair.color,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      this.arcsGroup.add(line);

      // Travelling energy packet
      const pulseGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      this.arcsGroup.add(pulse);

      this.pulses.push({
        mesh: pulse,
        curve: curve,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.005,
      });
    });
  }

  // Create orbiting satellite models with track rings
  createOrbitingSatellites() {
    const satelliteConfigs = [
      {
        name: "NASA FIRMS (VIIRS NRT)",
        orbitRadius: this.GLOBE_RADIUS * 1.38,
        inclination: 0.85,
        speed: 0.0055,
        color: 0xf43f5e, // Red/Coral hotspot feed
      },
      {
        name: "COPERNICUS SENTINEL",
        orbitRadius: this.GLOBE_RADIUS * 1.52,
        inclination: -0.65,
        speed: 0.0042,
        color: 0x38bdf8, // Cyan Earth observation
      },
    ];

    satelliteConfigs.forEach((cfg) => {
      // Orbit Path Ring
      const orbitGeo = new THREE.RingGeometry(cfg.orbitRadius - 0.3, cfg.orbitRadius + 0.3, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = cfg.inclination;
      orbitRing.rotation.y = Math.PI / 4;
      this.scene.add(orbitRing);

      // Satellite Object
      const satGroup = new THREE.Group();

      // Satellite main body (box)
      const bodyGeo = new THREE.BoxGeometry(2.5, 2.5, 4.0);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.8,
        roughness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(body);

      // Solar panel wings
      const panelGeo = new THREE.BoxGeometry(10, 0.4, 2.6);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x0c4a6e,
      });
      const panels = new THREE.Mesh(panelGeo, panelMat);
      satGroup.add(panels);

      // Indicator light
      const beaconGeo = new THREE.SphereGeometry(0.8, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 1.6, 0);
      satGroup.add(beacon);

      this.scene.add(satGroup);

      this.satellites.push({
        group: satGroup,
        radius: cfg.orbitRadius,
        inclination: cfg.inclination,
        angle: Math.random() * Math.PI * 2,
        speed: cfg.speed,
        cfg,
      });
    });
  }

  // Starry particle background
  createStarField() {
    const starCount = 600;
    const starPoints = [];
    const starColors = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 1600;
      const y = (Math.random() - 0.5) * 1200;
      const z = -200 + (Math.random() - 0.5) * 1200;

      // Keep outside the immediate globe view
      if (Math.sqrt(x * x + y * y + z * z) < 180) continue;

      starPoints.push(x, y, z);
      const brightness = 0.4 + Math.random() * 0.6;
      starColors.push(brightness, brightness * 0.95, brightness * 1.1);
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPoints, 3));
    starGeo.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    const starField = new THREE.Points(starGeo, starMat);
    this.scene.add(starField);
  }

  // Mouse & Touch Orbit Events
  setupEvents() {
    const el = this.renderer.domElement;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging) return;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.006;
      this.targetRotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, this.targetRotation.x + deltaY * 0.006)
      );

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Mouse listeners
    el.addEventListener("mousedown", (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onPointerUp);

    // Touch listeners
    el.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 1) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener("touchend", onPointerUp);

    // Window resize
    window.addEventListener("resize", () => this.onResize());

    // Connect to external interactive buttons if present
    const btnNusantara = document.getElementById("btn-3d-focus-nusantara");
    if (btnNusantara) {
      btnNusantara.addEventListener("click", () => this.focusNusantara());
    }

    const btnRotate = document.getElementById("btn-3d-toggle-rotate");
    if (btnRotate) {
      btnRotate.addEventListener("click", () => {
        this.autoRotate = !this.autoRotate;
        btnRotate.classList.toggle("active", this.autoRotate);
      });
    }
  }

  // Smoothly center camera view on Indonesia
  focusNusantara() {
    this.targetRotation.x = 0.05;
    this.targetRotation.y = -2.05; // Centered precisely on 115° E (Nusantara)
    this.autoRotate = false;
    const btnRotate = document.getElementById("btn-3d-toggle-rotate");
    if (btnRotate) btnRotate.classList.remove("active");
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // 1. Smooth rotation interpolation
    if (this.autoRotate && !this.isDragging) {
      this.targetRotation.y += this.autoRotateSpeed;
    }

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    this.globeGroup.rotation.x = this.currentRotation.x;
    this.globeGroup.rotation.y = this.currentRotation.y;

    // 2. Animate pulsating radar rings on beacons
    const time = Date.now() * 0.003;
    if (this.beacons) {
      this.beacons.forEach((b, idx) => {
        const scale = 1 + ((Math.sin(time * 2.5 + idx) + 1) / 2) * 2.2;
        b.ring.scale.set(scale, scale, scale);
        b.ring.material.opacity = Math.max(0, 1 - (scale - 1) / 2.2);
      });
    }

    // 3. Animate travelling pulses along 3D data arcs
    this.pulses.forEach((p) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;
      const point = p.curve.getPoint(p.progress);
      p.mesh.position.copy(point);
    });

    // 4. Animate satellites along inclined orbits
    this.satellites.forEach((sat) => {
      sat.angle += sat.speed;
      const x = Math.cos(sat.angle) * sat.radius;
      const z = Math.sin(sat.angle) * sat.radius;

      // Apply inclination
      const y = z * Math.sin(sat.inclination);
      const adjustedZ = z * Math.cos(sat.inclination);

      sat.group.position.set(x, y, adjustedZ);
      sat.group.lookAt(0, 0, 0);
      sat.group.rotateY(Math.PI / 2);
    });

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("nusantara-globe-3d-canvas");
  if (container) {
    window.nusantaraGlobeInstance = new NusantaraGlobe3D("nusantara-globe-3d-canvas");
  }
});

export { NusantaraGlobe3D };
