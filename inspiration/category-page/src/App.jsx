import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // --- GSAP Animations ---
    
    // Text Reveal Logic
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(el => {
      // Prevent double splitting in React StrictMode
      if (el.dataset.splitted) return;
      el.dataset.splitted = "true";
      
      const text = el.innerText;
      el.innerHTML = ''; 
      text.split(' ').forEach(word => {
        const wrapper = document.createElement('span');
        wrapper.className = 'inline-block overflow-hidden align-bottom pb-1 -mb-1 mr-[0.25em]';
        const inner = document.createElement('span');
        inner.className = 'inline-block translate-y-[110%] reveal-word';
        inner.innerText = word;
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });

      gsap.to(el.querySelectorAll('.reveal-word'), {
        y: '0%',
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Parallax Logic
    const parallaxTweens = [];
    document.querySelectorAll('.parallax-container').forEach(container => {
      const img = container.querySelector('.parallax-img');
      if (img) {
        const tween = gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
        parallaxTweens.push(tween);
      }
    });

    // --- WebGL Column Split Logic ---
    let reqId;
    let canvas = document.getElementById('vanguardis-webgl-canvas');
    if (canvas) canvas.remove();

    canvas = document.createElement('canvas');
    canvas.id = 'vanguardis-webgl-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1'; 
    document.body.appendChild(canvas);

    const scene = new THREE.Scene();
    const cameraZ = 600; 
    const fov = 2 * Math.atan((window.innerHeight / 2) / cameraZ) * (180 / Math.PI);
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = cameraZ;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const vertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uImageRes;
      uniform vec2 uPlaneRes;
      uniform float uColIndex;
      uniform float uCols;
      uniform float uGrayscale;
      varying vec2 vUv;

      void main() {
          vec2 fullUv = vec2((vUv.x + uColIndex) / uCols, vUv.y);
          
          vec2 ratio = vec2(
              min((uPlaneRes.x / uPlaneRes.y) / (uImageRes.x / uImageRes.y), 1.0),
              min((uPlaneRes.y / uPlaneRes.x) / (uImageRes.y / uImageRes.x), 1.0)
          );
          
          vec2 uv = vec2(
              fullUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
              fullUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 color = texture2D(uTexture, uv);
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = vec4(mix(color.rgb, vec3(gray), uGrayscale), color.a);
      }
    `;

    const measures = document.querySelectorAll('.webgl-measure');
    const items = [];
    const textureLoader = new THREE.TextureLoader();
    const columnsCount = 4;
    const baseGeometry = new THREE.PlaneGeometry(1, 1);

    const eventListeners = [];

    measures.forEach(measure => {
      const img = measure.querySelector('.webgl-img');
      const hasGrayscale = measure.hasAttribute('data-grayscale');
      const group = new THREE.Group();
      const meshes = [];
      
      let targetGrayscale = hasGrayscale ? 1.0 : 0.0;
      let currentGrayscale = targetGrayscale;

      if (hasGrayscale) {
        const enterHandler = () => { targetGrayscale = 0.0; };
        const leaveHandler = () => { targetGrayscale = 1.0; };
        measure.addEventListener('mouseenter', enterHandler);
        measure.addEventListener('mouseleave', leaveHandler);
        eventListeners.push({ el: measure, type: 'mouseenter', handler: enterHandler });
        eventListeners.push({ el: measure, type: 'mouseleave', handler: leaveHandler });
      }

      for (let i = 0; i < columnsCount; i++) {
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: null },
            uImageRes: { value: new THREE.Vector2(1, 1) },
            uPlaneRes: { value: new THREE.Vector2(1, 1) },
            uColIndex: { value: i },
            uCols: { value: columnsCount },
            uGrayscale: { value: currentGrayscale }
          },
          transparent: true
        });

        const mesh = new THREE.Mesh(baseGeometry, material);
        mesh.position.x = (i / columnsCount) - 0.5 + (1 / (columnsCount * 2));
        mesh.scale.set(1 / columnsCount, 1, 1);
        
        group.add(mesh);
        meshes.push(mesh);
      }

      if (img && img.src) {
        textureLoader.load(img.src, (texture) => {
          meshes.forEach(mesh => {
            mesh.material.uniforms.uTexture.value = texture;
            mesh.material.uniforms.uImageRes.value.set(img.naturalWidth || 1, img.naturalHeight || 1);
          });
        });
      }

      scene.add(group);
      items.push({ 
        measure, 
        group, 
        meshes, 
        hasGrayscale, 
        get target() { return targetGrayscale; }, 
        set current(v) { currentGrayscale = v; }, 
        get current() { return currentGrayscale; } 
      });
    });

    let scrollY = window.scrollY;
    let smoothScroll = scrollY;
    const staggers = [0.15, 0.35, 0.20, 0.40];

    function renderLoop() {
      scrollY = window.scrollY;
      smoothScroll += (scrollY - smoothScroll) * 0.08;
      
      let velocity = scrollY - smoothScroll;
      velocity = Math.max(Math.min(velocity, 300), -300);

      items.forEach(item => {
        const rect = item.measure.getBoundingClientRect();
        
        item.group.position.x = rect.left - window.innerWidth / 2 + rect.width / 2;
        item.group.position.y = -rect.top + window.innerHeight / 2 - rect.height / 2;
        item.group.scale.set(rect.width, rect.height, 1);

        if (item.hasGrayscale) {
          item.current += (item.target - item.current) * 0.1;
        }

        item.meshes.forEach((mesh, i) => {
          const floatY = -velocity * staggers[i] * 0.8;
          mesh.position.y = floatY / rect.height;

          mesh.material.uniforms.uPlaneRes.value.set(rect.width, rect.height);
          if (item.hasGrayscale) {
            mesh.material.uniforms.uGrayscale.value = item.current;
          }
        });
      });

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(renderLoop);
    }
    
    if (items.length > 0) {
      renderLoop();
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = 2 * Math.atan((window.innerHeight / 2) / cameraZ) * (180 / Math.PI);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', handleResize);
      eventListeners.forEach(({ el, type, handler }) => {
        el.removeEventListener(type, handler);
      });
      if (reqId) cancelAnimationFrame(reqId);
      
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (object.material.isMaterial) {
          if(object.material.uniforms?.uTexture?.value) {
            object.material.uniforms.uTexture.value.dispose();
          }
          object.material.dispose();
        }
      });
      
      renderer.dispose();
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <>
      {/* Vertical Container Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between border-x border-[#C4CFC0]/60">
          <div className="h-full border-r border-[#C4CFC0]/60 w-1/3 hidden md:block"></div>
          <div className="h-full border-r border-[#C4CFC0]/60 w-1/3 hidden md:block"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Navigation */}
        <header className="py-6 flex justify-between items-start border-b border-[#C4CFC0]">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-base uppercase tracking-widest text-[#2A3324]/70">
            <a href="#" className="hover:text-[#2A3324] transition-colors">Studio</a>
            <span>/</span>
            <a href="#" className="hover:text-[#2A3324] transition-colors">Expertise</a>
            <span>/</span>
            <a href="#" className="hover:text-[#2A3324] transition-colors">Vision</a>
            <span>/</span>
            <a href="#" className="hover:text-[#2A3324] transition-colors">Portfolio</a>
            <span>/</span>
            <a href="#" className="hover:text-[#2A3324] transition-colors">Journal</a>
          </nav>
          <div className="hidden sm:block text-[#5C715E]">
            <iconify-icon icon="solar:arrow-right-up-linear" className="text-4xl"></iconify-icon>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 relative z-10">
            <h1 className="font-serif-custom text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight font-normal w-full md:w-3/4">
              Architectural <br />
              <span className="italic pr-4">Innovations</span> <span className="hidden md:inline-block w-24 h-[2px] bg-[#2A3324] align-middle mb-4"></span> Habitats
            </h1>
            
            <div className="mt-8 md:mt-0 md:w-1/4 flex flex-col items-start md:items-end text-left md:text-right">
              <a href="#contact" className="inline-block border-b border-[#2A3324] pb-1 mb-6 text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Discuss Project</a>
              <div className="relative w-40 h-32 md:w-48 md:h-40 group cursor-pointer webgl-measure" data-grayscale="true">
                <div className="absolute inset-0 w-full h-full bg-transparent">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/69c241bd-fe7d-481f-8b0c-0a5ba80fb29e_800w.webp" alt="Small project preview" className="webgl-img w-full h-full object-cover opacity-0" />
                </div>
                <div className="absolute bottom-2 left-2 bg-[#2A3324] text-[#E3E7E0] p-1 rounded-sm flex items-center justify-center z-10">
                  <iconify-icon icon="solar:arrow-right-linear" className="text-base"></iconify-icon>
                </div>
              </div>
              <p className="text-sm mt-4 text-[#2A3324]/70 text-left">Developing timeless structures with minimal environmental footprint, altering the way we inhabit spaces.</p>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-y border-[#C4CFC0] text-base uppercase tracking-widest text-[#2A3324]/70">
            <span>Alpine Retreat Concept</span>
            <span className="hidden sm:block">2024</span>
            <span>Minimalist Dwelling</span>
          </div>

          {/* WebGL Enhanced Hero Image */}
          <div className="webgl-measure mt-4 w-full h-[400px] md:h-[600px] lg:h-[700px] relative">
            <div className="absolute inset-0 w-full h-full bg-transparent">
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/33f44bf5-8b59-437b-a1e3-87e3db3f82ec_1600w.webp" alt="Modern wooden house exterior" className="webgl-img w-full h-full object-cover opacity-0" />
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 text-base text-[#2A3324]/70">
            <span>Featured Work</span>
            <a href="#" className="hover:text-[#2A3324] transition-colors">Explore Project</a>
          </div>
        </section>

        {/* Logos Section (Marquee) */}
        <section className="py-12 border-t border-[#C4CFC0] overflow-hidden">
          <p className="text-base text-[#2A3324]/60 uppercase tracking-widest mb-8 text-center md:text-left">Trusted by industry leaders</p>
          <div className="w-full relative">
            <div className="marquee-track flex gap-16 md:gap-32 items-center opacity-70">
              <iconify-icon icon="simple-icons:nasa" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:spacex" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:uber" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:visa" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:sony" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:bose" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:nasa" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:spacex" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:uber" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:visa" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:sony" className="text-6xl"></iconify-icon>
              <iconify-icon icon="simple-icons:bose" className="text-6xl"></iconify-icon>
            </div>
          </div>
        </section>

        {/* Intro / About */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <h2 className="reveal-text font-serif-custom text-4xl sm:text-5xl md:text-6xl tracking-tight font-normal leading-tight pr-0 md:pr-12">
                At Vanguardis, we are committed to engineering progressive habitats that integrate seamlessly with their surroundings while defining modern living standards.
              </h2>
              <div className="mt-8">
                <a href="#" className="text-lg uppercase tracking-widest border-b border-[#2A3324] pb-1 hover:opacity-70 transition-opacity">Our Studio</a>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col justify-between">
              <p className="text-lg text-[#2A3324]/80 mb-8 md:mb-0">
                We pioneer a forward-thinking approach by fusing advanced structural engineering with ecological awareness. From passive thermal systems to the deliberate selection of regional materials, every endeavor is a testament to longevity and spatial harmony.
              </p>
              
              {/* WebGL Enhanced Detail Image */}
              <div className="webgl-measure relative w-full h-48 mt-auto group cursor-pointer">
                <div className="absolute inset-0 w-full h-full bg-transparent">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/7779de4b-5917-4029-a549-ad23ff8ff120_800w.webp" alt="Interior detail" className="webgl-img w-full h-full object-cover opacity-0" />
                </div>
                <div className="absolute top-2 right-2 bg-[#2A3324] text-[#E3E7E0] p-2 rounded-sm group-hover:bg-[#5C715E] transition-colors flex items-center justify-center z-10">
                  <iconify-icon icon="solar:arrow-right-linear" className="text-xl"></iconify-icon>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-base uppercase tracking-widest text-[#2A3324]/70 block mb-6">Expertise</span>
              <h2 className="font-serif-custom text-4xl md:text-5xl tracking-tight font-normal">
                Engineering Precision<br />Solutions for Any Scale
              </h2>
            </div>
            <a href="#" className="mt-6 md:mt-0 text-lg uppercase tracking-widest border-b border-[#2A3324] pb-1 hover:opacity-70 transition-opacity">Explore All</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#D5DBD1] p-8 md:p-10 flex flex-col h-full border-t-2 border-[#2A3324]">
              <span className="text-lg font-normal text-[#2A3324]/50 mb-6">01</span>
              <h3 className="font-serif-custom text-3xl tracking-tight font-normal mb-8 pr-8 leading-tight">Spatial<br />Architecture<br />Design</h3>
              <div className="mt-auto">
                <p className="text-lg text-[#2A3324]/70 mb-8">We engineer structural frameworks that optimize spatial flow, light penetration, and material efficiency for modern demands.</p>
                <div className="flex justify-start">
                  <button className="bg-[#2A3324] text-[#E3E7E0] p-3 hover:bg-[#5C715E] transition-colors rounded-sm flex items-center justify-center">
                    <iconify-icon icon="solar:arrow-right-linear" className="text-xl"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-[#D5DBD1] p-8 md:p-10 flex flex-col h-full border-t-2 border-[#5C715E]">
              <span className="text-lg font-normal text-[#2A3324]/50 mb-6">02</span>
              <h3 className="font-serif-custom text-3xl tracking-tight font-normal mb-8 pr-8 leading-tight">Ecological<br />Integration<br />Strategy</h3>
              <div className="mt-auto">
                <p className="text-lg text-[#2A3324]/70 mb-8">Our specialists provide blueprints for implementing passive energy systems and reducing overall structural carbon footprint.</p>
                <div className="flex justify-end">
                  <button className="bg-[#5C715E] text-[#E3E7E0] p-3 hover:bg-[#2A3324] transition-colors rounded-sm flex items-center justify-center">
                    <iconify-icon icon="solar:arrow-right-linear" className="text-xl"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#D5DBD1] p-8 md:p-10 flex flex-col h-full border-t-2 border-[#2A3324]">
              <span className="text-lg font-normal text-[#2A3324]/50 mb-6">03</span>
              <h3 className="font-serif-custom text-3xl tracking-tight font-normal mb-8 pr-8 leading-tight">Lifecycle<br />Planning<br />&amp; Execution</h3>
              <div className="mt-auto">
                <p className="text-lg text-[#2A3324]/70 mb-8">From initial schematics to final structural deployment, we manage the complete lifecycle of your architectural project.</p>
                <div className="flex justify-end">
                  <button className="bg-[#5C715E] text-[#E3E7E0] p-3 hover:bg-[#2A3324] transition-colors rounded-sm flex items-center justify-center">
                    <iconify-icon icon="solar:arrow-right-linear" className="text-xl"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0]">
          <div className="mb-12 md:mb-16">
            <span className="text-base uppercase tracking-widest text-[#2A3324]/70">Client Perspectives</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col h-full">
              <p className="font-serif-custom text-2xl lg:text-3xl tracking-tight font-normal italic mb-8 flex-grow">"Vanguardis transformed our operational brief into a physical reality that exceeds all structural and aesthetic expectations."</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[#C4CFC0]/60 mt-auto">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&auto=format&fit=crop" alt="Client" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#2A3324] font-normal">Elena Rostova</p>
                  <p className="text-xs uppercase tracking-widest text-[#2A3324]/60">Director, Nexus Corp</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <p className="font-serif-custom text-2xl lg:text-3xl tracking-tight font-normal italic mb-8 flex-grow">"Their approach to passive thermal systems reduced our energy overhead drastically, without compromising the minimalist aesthetic we demanded."</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[#C4CFC0]/60 mt-auto">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop" alt="Client" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#2A3324] font-normal">Marcus Lin</p>
                  <p className="text-xs uppercase tracking-widest text-[#2A3324]/60">Founder, Aura Developments</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <p className="font-serif-custom text-2xl lg:text-3xl tracking-tight font-normal italic mb-8 flex-grow">"Uncompromising precision. The entire lifecycle planning executed by their studio was flawless from the initial sketches to deployment."</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[#C4CFC0]/60 mt-auto">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop" alt="Client" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#2A3324] font-normal">Sarah Jenkins</p>
                  <p className="text-xs uppercase tracking-widest text-[#2A3324]/60">VP Operations, Meridian</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Width Image Block (Parallax) */}
        <section className="py-8 border-t border-[#C4CFC0]">
          <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center text-center overflow-hidden parallax-container">
            <div className="absolute inset-0 z-0 h-[130%] -top-[15%] w-full parallax-img">
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1011c60a-8855-4004-9fb1-f4ec3c3c6c6f_1600w.webp" alt="Architecture structural wood" className="w-full h-full object-cover brightness-75" />
            </div>
            <div className="relative z-10 text-[#E3E7E0] px-4">
              <span className="text-base uppercase tracking-widest mb-4 block">Perspective</span>
              <h2 className="font-serif-custom text-5xl md:text-7xl lg:text-8xl tracking-tight font-normal leading-tight">
                Construct Your<br />Masterpiece
              </h2>
            </div>
          </div>
        </section>

        {/* Details / Stats */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0]">
          <div className="flex justify-end mb-8">
            <span className="text-base uppercase tracking-widest text-[#2A3324]/70">Metrics</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="flex flex-col justify-between">
              <p className="text-lg text-[#2A3324]/80 mb-12 lg:pr-12">
                Every structure we engineer reflects our dedication to establishing enduring, resilient habitats that accommodate future generations while respecting current topographies.
              </p>
              
              {/* WebGL Enhanced Stats Image */}
              <div className="webgl-measure relative w-full h-64 md:h-80 mt-auto">
                <div className="absolute inset-0 w-full h-full bg-transparent">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5299d143-9d4c-4971-8471-be515b29c79e_1600w.webp" alt="Modern building structure" className="webgl-img w-full h-full object-cover mt-auto opacity-0" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif-custom text-4xl md:text-5xl tracking-tight font-normal mb-12">
                Forward-Thinking Spaces,<br />Engineered for Longevity
              </h2>
              
              <div className="flex flex-col text-lg">
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Execution Year</span>
                  <span className="font-normal">2024</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Total Floor Area</span>
                  <span className="font-normal">14,500 sq meters</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Locally Sourced Materials</span>
                  <span className="font-normal">85% by volume</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Thermal Efficiency Rating</span>
                  <span className="font-normal">A+ Certified</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Energy Autonomy</span>
                  <span className="font-normal">Solar Grid Integration</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0]">
                  <span className="text-[#2A3324]/70">Structural Lifespan Est.</span>
                  <span className="font-normal">120+ Years</span>
                </div>
                <div className="flex justify-between py-5 border-t border-[#C4CFC0] border-b">
                  <span className="text-[#2A3324]/70">Maintenance Reduction</span>
                  <span className="font-normal">30% lower overhead</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0] flex flex-col items-start relative">
          <div className="flex justify-between w-full items-center mb-8">
            <div className="flex gap-2">
              <button className="bg-[#2A3324] text-[#E3E7E0] p-2 hover:bg-[#5C715E] transition-colors rounded-sm flex items-center justify-center">
                <iconify-icon icon="solar:arrow-left-linear" className="text-xl"></iconify-icon>
              </button>
              <button className="bg-[#2A3324] text-[#E3E7E0] p-2 hover:bg-[#5C715E] transition-colors rounded-sm flex items-center justify-center">
                <iconify-icon icon="solar:arrow-right-linear" className="text-xl"></iconify-icon>
              </button>
            </div>
            <a href="#" className="text-lg uppercase tracking-widest border-b border-[#2A3324] pb-1 hover:opacity-70 transition-opacity">Full Archive</a>
          </div>
          
          <div className="flex justify-between items-end w-full">
            <h2 className="font-serif-custom text-6xl md:text-8xl lg:text-9xl tracking-tight font-normal leading-none z-10">
              Initiate Your<br />Next Structure
            </h2>
            <div className="text-[#5C715E] hidden md:block z-10">
              <iconify-icon icon="solar:arrow-right-up-linear" className="text-8xl lg:text-9xl" style={{ strokeWidth: '1px' }}></iconify-icon>
            </div>
          </div>
          
          {/* Abstract background graphic */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-1/2 h-full z-0 flex items-end justify-end overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] stroke-[#2A3324] fill-none stroke-[0.2]" preserveAspectRatio="none">
              <path d="M10,90 L90,90 L90,10 L50,40 Z M30,90 L30,50 L70,50 L70,90"></path>
              <line x1="10" y1="10" x2="90" y2="90"></line>
              <line x1="10" y1="30" x2="90" y2="30"></line>
              <line x1="10" y1="50" x2="90" y2="50"></line>
              <line x1="10" y1="70" x2="90" y2="70"></line>
            </svg>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 border-t border-[#C4CFC0]" id="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="flex flex-col">
              <span className="text-base uppercase tracking-widest text-[#2A3324]/70 block mb-6">Inquiries</span>
              <h2 className="font-serif-custom text-5xl md:text-6xl lg:text-7xl tracking-tight font-normal leading-tight mb-12">
                Let's discuss<br />your next project.
              </h2>
              <div className="flex flex-col gap-8 mt-auto">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#2A3324]/50 mb-2">Headquarters</p>
                  <p className="text-lg">124 Vanguard Way<br />Architecture District<br />London, UK</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#2A3324]/50 mb-2">Direct Communications</p>
                  <a href="mailto:studio@vanguardis.com" className="text-lg block hover:opacity-70 transition-opacity">studio@vanguardis.com</a>
                  <a href="tel:+442012345678" className="text-lg block hover:opacity-70 transition-opacity mt-1">+44 20 1234 5678</a>
                </div>
              </div>
            </div>

            <div className="bg-[#D5DBD1] p-8 md:p-12 border-t-2 border-[#2A3324] flex flex-col justify-center">
              <form className="flex flex-col gap-8">
                <div className="relative">
                  <input type="text" id="name" className="w-full bg-transparent border-b border-[#2A3324]/30 py-4 text-base focus:outline-none focus:border-[#2A3324] transition-colors placeholder-[#2A3324]/50" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <input type="email" id="email" className="w-full bg-transparent border-b border-[#2A3324]/30 py-4 text-base focus:outline-none focus:border-[#2A3324] transition-colors placeholder-[#2A3324]/50" placeholder="Email Address" />
                </div>
                
                {/* Custom Select Dropdown UI */}
                <div className="relative group cursor-pointer">
                  <div className="w-full bg-transparent border-b border-[#2A3324]/30 py-4 flex items-center justify-between group-hover:border-[#2A3324] transition-colors">
                    <span className="text-base text-[#2A3324]/50 group-hover:text-[#2A3324] transition-colors">Project Type</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" className="text-xl text-[#2A3324]/50 group-hover:text-[#2A3324] transition-colors"></iconify-icon>
                  </div>
                </div>

                <div className="relative">
                  <textarea id="message" rows="3" className="w-full bg-transparent border-b border-[#2A3324]/30 py-4 text-base focus:outline-none focus:border-[#2A3324] transition-colors resize-none placeholder-[#2A3324]/50" placeholder="Brief Description"></textarea>
                </div>
                
                <button type="button" className="mt-4 bg-[#2A3324] text-[#E3E7E0] py-4 px-6 text-sm uppercase tracking-widest hover:bg-[#5C715E] transition-colors flex justify-between items-center w-full group">
                  Submit Inquiry
                  <iconify-icon icon="solar:arrow-right-linear" className="text-xl group-hover:translate-x-1 transition-transform"></iconify-icon>
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-[#2A3324] text-[#E3E7E0] pt-16 md:pt-24 pb-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="font-serif-custom text-3xl md:text-4xl tracking-tight font-normal mb-6">Vanguardis</h3>
              <p className="text-lg text-[#E3E7E0]/70 max-w-sm font-light">
                We engage in forging advanced habitats by merging progressive structural engineering with conscious material application.
              </p>
            </div>
            
            <div className="flex md:justify-end items-end opacity-10 pointer-events-none select-none mt-12 md:mt-0">
              <h3 className="font-serif-custom text-8xl md:text-9xl leading-none tracking-tight">Vanguardis</h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E3E7E0]/20 text-base uppercase tracking-widest text-[#E3E7E0]/60">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-6 md:mb-0">
              <a href="#" className="hover:text-[#E3E7E0] transition-colors">Studio</a>
              <a href="#" className="hover:text-[#E3E7E0] transition-colors">Expertise</a>
              <a href="#" className="hover:text-[#E3E7E0] transition-colors">Vision</a>
              <a href="#" className="hover:text-[#E3E7E0] transition-colors">Portfolio</a>
              <a href="#" className="hover:text-[#E3E7E0] transition-colors">Journal</a>
            </nav>
            <p>© 2024 Vanguardis Ltd.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;