/**
 * Componente para renderizar una sección (tanto tab como vista completa)
 *
 * JSON schema esperado para cada `section` (archivo: `src/data/sections.js`):
 *
 * {
 *   id: string,           // identificador único (ej. 'entrada4')
 *   title: string,        // título de la entrada
 *   subtitle: string,     // subtítulo opcional
 *   icon: string,         // ruta a icono (.svg preferido, .webp con fallback)
 *   image: string,        // imagen principal (opcional)
 *   excerpt: string,      // resumen corto para listados
 *   sources: [string],    // lista de fuentes/URLs
 *   content: [block]      // array de bloques (ver tipos abajo)
 * }
 *
 * Bloques (`block`) soportados:
 * - paragraph / html:
 *   { type: 'paragraph'|'html', text: string, image?: string, alt?: string, imageWidth?: number|string, imageHeight?: number|string }
 *
 * - image:
 *   { type: 'image', src: string, alt?: string, align?: 'left'|'center'|'right', width?: number|string, height?: number|string }
 *
 * - code:
 *   { type: 'code', language?: string, code?: string, text?: string, module?: string, show?: boolean }
 *   - `module` permite cargar el archivo fuente del módulo con `fetch` para mostrarlo.
 *   - `show` (boolean): si está presente el renderer crea un botón toggle "Mostrar/Ocultar código";
 *     si `show: true` se muestra el código inicialmente.
 *
 * - table:
 *   { type: 'table', headers: [string], rows: [[string]] }
 *
 * - demo:
 *   { type: 'demo', module: string, label?: string, placeholder?: string, example?: string, buttonText?: string, show?: boolean }
 *   - `module` debe exportar la API usada por el demo (p.ej. `CriptoRSA.generarClaves`, `cifrar`, `descifrar`).
 *   - `show` comporta igual que en `code` (toggle para mostrar código fuente del módulo).
 *
 * El renderer acepta propiedades de compatibilidad (p.ej. `image` o `icon`) y usa
 * import dinámico (`import(modulePath)`) para ejecutar demos en tiempo de ejecución.
 */

// Load component-specific styles (adds a <link> to document.head)
(function loadStyles(){
  try {
    if (typeof document === 'undefined') return;
    if (document.getElementById('sectioncard-styles')) return;
    const l = document.createElement('link');
    l.id = 'sectioncard-styles';
    l.rel = 'stylesheet';
    l.href = './src/components/sectionCard.css';
    document.head.appendChild(l);
  } catch (e) {
    // ignore in non-browser environments
  }
})();
export function createSectionTab(section, index) {
  const li = document.createElement('li');
  li.className = 'tab';
  li.dataset.id = section.id ?? index;

  // create icon for tab (replace numeric badge)
  function iconFallbackTab(src) {
    if (!src) return 'https://via.placeholder.com/34?text=?';
    if (src.endsWith('.webp')) return src.replace(/\.webp$/i, '.svg');
    return src;
  }
  const iconSrc = iconFallbackTab(section.icon || section.image);
  const iconWrap = document.createElement('span');
  iconWrap.className = 'tab-icon';
  const iconImg = document.createElement('img');
  // try svg first, fallback to provided icon/webp if svg not available
  const originalTabIcon = section.icon || section.image;
  iconImg.src = iconSrc;
  if (iconSrc !== originalTabIcon) {
    iconImg.onerror = () => { iconImg.onerror = null; iconImg.src = originalTabIcon; };
  }
  iconImg.alt = section.title + ' icon';
  iconWrap.appendChild(iconImg);

  const title = document.createElement('div');
  title.innerHTML = `<strong>${section.title}</strong><div class="muted">${section.subtitle || ''}</div>`;

  li.appendChild(iconWrap);
  li.appendChild(title);

  return li;
}

export function createListItem(section, index) {
  const wrap = document.createElement('article');
  wrap.className = 'list-item';
  wrap.dataset.id = section.id ?? index;

  // Determine icon source: prefer `icon` key, fall back to `image` for compatibility
  function iconFallback(src) {
    if (!src) return 'https://via.placeholder.com/48?text=?';
    if (src.endsWith('.webp')) return src.replace(/\.webp$/i, '.svg');
    return src;
  }

  const meta = document.createElement('div');
  meta.className = 'meta';

  const iconSrc = iconFallback(section.icon || section.image);
  const iconImg = document.createElement('img');
  iconImg.className = 'section-icon';
  const originalIcon = section.icon || section.image;
  iconImg.src = iconSrc;
  if (iconSrc !== originalIcon) {
    iconImg.onerror = () => { iconImg.onerror = null; iconImg.src = originalIcon; };
  }
  iconImg.alt = section.title + ' icon';

  meta.innerHTML = `<h3>${section.title}</h3><p>${section.excerpt || ''}</p>`;

  const action = document.createElement('div');
  action.innerHTML = `<a class="read-btn" href="#${section.id}">Leer más →</a>`;

  // prepend icon into meta
  meta.insertBefore(iconImg, meta.firstChild);

  wrap.appendChild(meta);
  wrap.appendChild(action);

  return wrap;
}

export function createDetailView(section) {
  const out = document.createElement('div');
  out.className = 'detail';

  const header = document.createElement('div');
  header.className = 'detail-header';
  // add back button placeholder (handled by main.js)
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.type = 'button';
  back.setAttribute('aria-label', 'Volver al inicio');
  // left chevron SVG (larger)
  back.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const titleWrap = document.createElement('div');
  titleWrap.className = 'detail-title';
  titleWrap.innerHTML = `<h2>${section.title}</h2>`;

  // subtitle will be a separate element below header
  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'muted detail-subtitle';
  subtitleEl.textContent = section.subtitle || '';

  header.appendChild(back);
  header.appendChild(titleWrap);

  function imgFallback(src) {
    if (!src) return null;
    if (src.endsWith('.webp')) return src.replace(/\.webp$/i, '.svg');
    return src;
  }

  const content = document.createElement('div');
  content.className = 'detail-content';

  // render content: support string (legacy) or array of blocks
  const blocks = Array.isArray(section.content) ? section.content : (section.content ? [{ type: 'html', text: section.content }] : []);

  out.appendChild(header);
  // subtitle separate and centered below header
  if (subtitleEl && subtitleEl.textContent) out.appendChild(subtitleEl);

  blocks.forEach((blk) => {
    if (!blk) return;
    const align = (blk.align || blk.alignment || 'center').toString().toLowerCase();
    if (blk.type === 'paragraph' || blk.type === 'html' || !blk.type) {
      // render text first
      // wrap block content to contain floats and spacing
      const blockWrap = document.createElement('div');
      blockWrap.className = 'detail-block';

      const p = document.createElement('div');
      p.className = 'detail-paragraph';
      p.innerHTML = blk.text || '';
      blockWrap.appendChild(p);

      // optional image for this block (render below text)
      if (blk.image) {
        const pic = document.createElement('picture');
        if (blk.image.endsWith('.webp')) {
          const s = document.createElement('source');
          s.type = 'image/webp';
          s.srcset = blk.image;
          pic.appendChild(s);
        }
        const im = document.createElement('img');
        const candidate = imgFallback(blk.image);
        im.src = candidate || blk.image;
        if (candidate && candidate !== blk.image) {
          im.onerror = () => { im.onerror = null; im.src = blk.image; };
        }
        im.alt = blk.alt || section.title;
        im.classList.add('block-media');
        // apply alignment class
        im.classList.add(`align-${align}`);
        // apply explicit sizing if provided in JSON (accepts number or css string)
        const w = blk.imageWidth ?? blk.width;
        const h = blk.imageHeight ?? blk.height;
        if (w !== undefined && w !== null) {
          im.style.width = typeof w === 'number' ? `${w}px` : w.toString();
        }
        if (h !== undefined && h !== null) {
          im.style.height = typeof h === 'number' ? `${h}px` : h.toString();
        }
        pic.appendChild(im);
        blockWrap.appendChild(pic);
      }

      content.appendChild(blockWrap);
    } else if (blk.type === 'image') {
      // image-only block: wrap to contain floats
      const blockWrapImg = document.createElement('div');
      blockWrapImg.className = 'detail-block';
      const pic = document.createElement('picture');
      if (blk.src && blk.src.endsWith('.webp')) {
        const s = document.createElement('source');
        s.type = 'image/webp';
        s.srcset = blk.src;
        pic.appendChild(s);
      }
      const im = document.createElement('img');
      const candidate = imgFallback(blk.src);
      im.src = candidate || blk.src;
      if (candidate && candidate !== blk.src) {
        im.onerror = () => { im.onerror = null; im.src = blk.src; };
      }
      im.alt = blk.alt || section.title;
      im.classList.add('block-media');
      const alignImg = (blk.align || blk.alignment || 'center').toString().toLowerCase();
      im.classList.add(`align-${alignImg}`);
      const w2 = blk.imageWidth ?? blk.width;
      const h2 = blk.imageHeight ?? blk.height;
      if (w2 !== undefined && w2 !== null) {
        im.style.width = typeof w2 === 'number' ? `${w2}px` : w2.toString();
      }
      if (h2 !== undefined && h2 !== null) {
        im.style.height = typeof h2 === 'number' ? `${h2}px` : h2.toString();
      }
      pic.appendChild(im);
      blockWrapImg.appendChild(pic);
      content.appendChild(blockWrapImg);
    } else if (blk.type === 'code') {
      // render code block with optional remote module import and show-toggle
      const blockWrapCode = document.createElement('div');
      blockWrapCode.className = 'detail-block code-block';

      const codeWrap = document.createElement('div');
      codeWrap.className = 'code-viewer';
      // inner pre/code
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.className = blk.language ? `language-${blk.language}` : 'language-javascript';
      pre.appendChild(code);
      codeWrap.appendChild(pre);

      // loader state
      let codeLoaded = false;

      // helper to load code (from blk.module or inline blk.code)
      async function loadCode() {
        if (codeLoaded) return;
        try {
          if (blk.module) {
            const modulePath = blk.module;
            const moduleUrl = (typeof import.meta !== 'undefined') ? new URL(modulePath, import.meta.url).href : modulePath;
            const res = await fetch(moduleUrl);
            const src = await res.text();
            code.textContent = src;
          } else {
            code.textContent = blk.code || blk.text || '';
          }
        } catch (err) {
          code.textContent = 'Error cargando código: ' + String(err);
        }
        codeLoaded = true;
      }

      // If blk.show is present, add a toggle button to show/hide the code viewer
      if (Object.prototype.hasOwnProperty.call(blk, 'show')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'code-toggle-btn';
        toggleBtn.textContent = blk.show ? 'Ocultar código' : 'Mostrar código';
        // initial visibility
        codeWrap.style.display = blk.show ? '' : 'none';
        // if initially visible, start loading
        if (blk.show) loadCode();

        toggleBtn.addEventListener('click', async () => {
          const isHidden = codeWrap.style.display === 'none';
          if (isHidden) {
            // about to show
            await loadCode();
            codeWrap.style.display = '';
            toggleBtn.textContent = 'Ocultar código';
          } else {
            codeWrap.style.display = 'none';
            toggleBtn.textContent = 'Mostrar código';
          }
        });

        blockWrapCode.appendChild(toggleBtn);
      } else {
        // no toggle requested: render code inline immediately (use inline code or module if provided)
        // if module specified, try to fetch now but don't block rendering
        if (blk.module) loadCode();
        else code.textContent = blk.code || blk.text || '';
      }

      blockWrapCode.appendChild(codeWrap);
      content.appendChild(blockWrapCode);
    } else if (blk.type === 'table') {
      // render table block with headers and rows
      const blockWrapTable = document.createElement('div');
      blockWrapTable.className = 'detail-block table-block';
      const table = document.createElement('table');
      table.className = 'detail-table';
      // headers
      if (Array.isArray(blk.headers) && blk.headers.length) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        blk.headers.forEach(h => {
          const th = document.createElement('th');
          th.textContent = h;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
      }
      // rows
      if (Array.isArray(blk.rows) && blk.rows.length) {
        const tbody = document.createElement('tbody');
        blk.rows.forEach(r => {
          const tr = document.createElement('tr');
          r.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
      }
      blockWrapTable.appendChild(table);
      content.appendChild(blockWrapTable);
    }
    else if (blk.type === 'demo') {
      // interactive demo block: input + execute button + output
      const blockWrapDemo = document.createElement('div');
      blockWrapDemo.className = 'detail-block demo-wrap';

      const label = document.createElement('label');
      label.textContent = blk.label || 'Texto a cifrar';
      label.className = 'demo-label';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'demo-input';
      input.value = blk.example || blk.placeholder || '';
      input.placeholder = blk.placeholder || '';

      const controls = document.createElement('div');
      controls.className = 'demo-controls';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'demo-btn';
      btn.textContent = blk.buttonText || 'Ejecutar demo';
      controls.appendChild(btn);

      const outWrap = document.createElement('div');
      outWrap.className = 'demo-output';

      // optional code viewer (toggle) when blk.show is defined
      let codeLoaded = false;
      const codeWrap = document.createElement('div');
      codeWrap.className = 'demo-code-block';
      codeWrap.style.display = 'none';
      const codePre = document.createElement('pre');
      const codeEl = document.createElement('code');
      codeEl.className = blk.language ? `language-${blk.language}` : 'language-javascript';
      codePre.appendChild(codeEl);
      codeWrap.appendChild(codePre);

      let toggleBtn = null;
      if (Object.prototype.hasOwnProperty.call(blk, 'show')) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'demo-code-toggle';
        toggleBtn.textContent = blk.show ? 'Ocultar código' : 'Mostrar código';
        // place toggle before controls
        blockWrapDemo.insertBefore(toggleBtn, controls);

        toggleBtn.addEventListener('click', async () => {
          if (!codeLoaded) {
            try {
              const modulePath = blk.module || '../lib/CriptoRSA.js';
              const moduleUrl = (typeof import.meta !== 'undefined') ? new URL(modulePath, import.meta.url).href : modulePath;
              const res = await fetch(moduleUrl);
              const src = await res.text();
              codeEl.textContent = src;
              codeLoaded = true;
            } catch (err) {
              codeEl.textContent = 'Error cargando código: ' + String(err);
              codeLoaded = true;
            }
          }
          const isHidden = codeWrap.style.display === 'none';
          codeWrap.style.display = isHidden ? '' : 'none';
          toggleBtn.textContent = isHidden ? 'Ocultar código' : 'Mostrar código';
        });
      }

      blockWrapDemo.appendChild(codeWrap);

      blockWrapDemo.appendChild(label);
      blockWrapDemo.appendChild(input);
      blockWrapDemo.appendChild(controls);
      blockWrapDemo.appendChild(outWrap);

      // helper: base64
      function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
      }

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Ejecutando...';
        outWrap.innerHTML = '';
        const modulePath = blk.module || '../lib/CriptoRSA.js';
        try {
          const mod = await import(modulePath);
          const impl = mod.CriptoRSA || mod.default || mod;
          const message = input.value || '';
          const kp = await impl.generarClaves();
          const encrypted = await impl.cifrar(message, kp.publicKey);
          const encB64 = arrayBufferToBase64(encrypted.buffer || encrypted);
          const dec = await impl.descifrar(encrypted.buffer || encrypted, kp.privateKey);

          const preIn = document.createElement('pre'); preIn.textContent = 'Texto original: ' + message;
          const preEnc = document.createElement('pre'); preEnc.textContent = 'Cifrado (base64): ' + encB64;
          const preOut = document.createElement('pre'); preOut.textContent = 'Descifrado: ' + dec;
          outWrap.appendChild(preIn);
          outWrap.appendChild(preEnc);
          outWrap.appendChild(preOut);
          btn.textContent = 'Completado';
        } catch (err) {
          const errPre = document.createElement('pre');
          errPre.textContent = String(err);
          outWrap.appendChild(errPre);
          btn.textContent = 'Error';
        } finally {
          btn.disabled = false;
        }
      });

      content.appendChild(blockWrapDemo);
    }
  });

  out.appendChild(content);

  // no floating scroll button here; header is sticky only

  // append sources / referencias if present
  if (Array.isArray(section.sources) && section.sources.length) {
    const srcWrap = document.createElement('div');
    srcWrap.className = 'detail-block detail-sources';
    const h = document.createElement('h4');
    h.textContent = 'Fuentes';
    srcWrap.appendChild(h);
    const ul = document.createElement('ul');
    section.sources.forEach(s => {
      const li = document.createElement('li');
      // if source looks like a URL, render as link
      try {
        const url = new URL(s);
        const a = document.createElement('a');
        a.href = url.href;
        a.textContent = s;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
      } catch (e) {
        li.textContent = s;
      }
      ul.appendChild(li);
    });
    srcWrap.appendChild(ul);
    out.appendChild(srcWrap);
  }

  // no floating scroll button here; header is sticky only

  return out;
}

export function createWelcomeView(home) {
  const out = document.createElement('div');
  out.className = 'welcome';

  const header = document.createElement('div');
  header.className = 'welcome-header';
  header.innerHTML = `<h2>${home.title}</h2><p class="muted">${home.subtitle || ''}</p>`;

  function imgFallbackHome(src) {
    if (!src) return null;
    if (src.endsWith('.webp')) return src.replace(/\.webp$/i, '.svg');
    return src;
  }

  let picture = null;
  if (home.image) {
    picture = document.createElement('picture');
    if (home.image.endsWith('.webp')) {
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = home.image;
      picture.appendChild(source);
    }
    const imgEl = document.createElement('img');
    const homeCandidate = imgFallbackHome(home.image);
    const homeOriginal = home.image;
    imgEl.src = homeCandidate;
    if (homeCandidate !== homeOriginal) {
      imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = homeOriginal; };
    }
    imgEl.alt = home.title;
    imgEl.style.width = '100%';
    imgEl.style.borderRadius = '10px';
    picture.className = 'welcome-media';
    picture.appendChild(imgEl);
  }

  const content = document.createElement('div');
  content.className = 'welcome-content';
  content.innerHTML = home.content || '';

  out.appendChild(header);
  if (picture) out.appendChild(picture);
  out.appendChild(content);

  return out;
}

export function bindListHandlers(sections, listEl, onSelect) {
  if (!listEl) return;
  listEl.addEventListener('click', (e) => {
    const item = e.target.closest('.list-item');
    if (!item) return;
    const id = item.dataset.id;
    const sec = sections.find(s => (s.id || '') === id || sections.indexOf(s).toString() === id);
    if (!sec) return;
    onSelect(sec);
  });
}

