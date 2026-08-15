// Lightweight wrapper around the Web Crypto API for demo purposes.
// This module exposes a small `CriptoRSA` helper class with static methods
// to generate an RSA-OAEP key pair, encrypt and decrypt messages, plus a
// convenience `demo` function that runs the flow and appends results to
// the DOM for demonstration.
export class CriptoRSA {
  /**
   * Genera un par de claves RSA-OAEP en el navegador.
   * - `modulusLength`: tamaño de la clave en bits (2048 es una elección segura para demos).
   * - `publicExponent`: 0x010001 (65537) es el exponente público común.
   * - `hash`: algoritmo hash para OAEP (SHA-256 aquí).
   * @returns {Promise<CryptoKeyPair>} Par de claves (publicKey, privateKey)
   */
  static async generarClaves() {
    return await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' }
      },
      true, // claves exportables (true) para permitir uso en demo
      ['encrypt', 'decrypt'] // usos permitidos: cifrar con la pública, descifrar con la privada
    );
  }

  /**
   * Cifra un texto con la clave pública usando RSA-OAEP.
   * Convierte el texto a bytes usando `TextEncoder`, llama a `crypto.subtle.encrypt`
   * y devuelve un `Uint8Array` con el resultado cifrado.
   * @param {string} mensaje Texto plano a cifrar
   * @param {CryptoKey} clavePublica Clave pública para cifrado
   * @returns {Promise<Uint8Array>} Datos cifrados
   */
  static async cifrar(mensaje, clavePublica) {
    const encoder = new TextEncoder();
    const datos = encoder.encode(mensaje);
    // `encrypt` devuelve un ArrayBuffer
    const buffer = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, clavePublica, datos);
    // convertir a Uint8Array es conveniente para manejar y serializar
    return new Uint8Array(buffer);
  }

  /**
   * Descifra datos cifrados (ArrayBuffer o TypedArray) usando la clave privada.
   * Devuelve el texto descifrado como string (decodificado con `TextDecoder`).
   * @param {ArrayBuffer|TypedArray} datosCifrados Datos cifrados
   * @param {CryptoKey} clavePrivada Clave privada para descifrado
   * @returns {Promise<string>} Texto descifrado
   */
  static async descifrar(datosCifrados, clavePrivada) {
    // `decrypt` espera un ArrayBuffer; si llega un TypedArray, su `.buffer` lo proporciona
    const bufferInput = datosCifrados instanceof ArrayBuffer ? datosCifrados : datosCifrados.buffer || datosCifrados;
    const buffer = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, clavePrivada, bufferInput);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }
}

// Helper: convierte un ArrayBuffer grande a base64 de forma segura y eficiente.
// El bucle en trozos evita problemas con llamadas a `String.fromCharCode` sobre arrays muy grandes.
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB por trozo
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Función demo que ejecuta el flujo completo: generación de claves, cifrado
 * y descifrado. Sirve principalmente para mostrar resultados en la interfaz.
 * - `container`: elemento DOM donde se añadirán los resultados (por defecto `document.body`).
 * - `message`: texto a cifrar en la demo.
 * Devuelve el nodo raíz creado para permitir inspección o limpieza desde el llamador.
 */
export async function demo(container = document.body, message = 'Mensaje de ejemplo') {
  if (!container) container = document.body;
  const root = document.createElement('div');
  root.className = 'crypto-demo';

  const heading = document.createElement('h3');
  heading.textContent = 'Demo CriptoRSA (Web Crypto)';
  root.appendChild(heading);

  const status = document.createElement('div');
  status.textContent = 'Generando par de claves...';
  root.appendChild(status);

  try {
    // Generamos el par de claves (pública y privada)
    const kp = await CriptoRSA.generarClaves();
    status.textContent = 'Claves generadas. Cifrando mensaje...';

    // Ciframos el mensaje con la clave pública
    const encrypted = await CriptoRSA.cifrar(message, kp.publicKey);
    // `encrypted` es un Uint8Array; para mostrarlo podemos convertir a base64
    const encryptedB64 = arrayBufferToBase64(encrypted.buffer);
    status.textContent = 'Mensaje cifrado. Descifrando...';

    // Desciframos usando la clave privada. Aseguramos pasar el ArrayBuffer correcto.
    const decrypted = await CriptoRSA.descifrar(encrypted.buffer, kp.privateKey);
    status.textContent = 'Operación completa.';

    // Mostramos resultados en elementos <pre> para preservación de formato
    const preIn = document.createElement('pre');
    preIn.textContent = 'Texto original: ' + message;
    const preEnc = document.createElement('pre');
    preEnc.textContent = 'Cifrado (base64): ' + encryptedB64;
    const preOut = document.createElement('pre');
    preOut.textContent = 'Descifrado: ' + decrypted;

    root.appendChild(preIn);
    root.appendChild(preEnc);
    root.appendChild(preOut);
  } catch (err) {
    // Notificamos error al usuario y añadimos detalle técnico debajo
    status.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
    const errPre = document.createElement('pre');
    errPre.textContent = String(err);
    root.appendChild(errPre);
  }

  container.appendChild(root);
  return root;
}

export default CriptoRSA;
