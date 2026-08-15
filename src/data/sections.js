// Secciones generadas desde data.md
// Generated from data_plain_converted.md
export const sections = [
  {
    id: 'entrada1',
    title: 'Fundamentos del Cifrado Asimétrico: Claves Públicas y Privadas',
    subtitle: 'Fundamentos',
    icon: 'assets/icons/keys.webp',
    sources: [
      'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
      'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'La necesidad de intercambiar información de forma confidencial y segura a través de canales inherentemente inseguros (como el internet actual) impulsó una de las mayores revoluciones de la informática: la criptografía asimétrica o de clave pública.'
      },
      {
        type: 'paragraph',
        text: 'A diferencia de los métodos tradicionales, este modelo elimina la necesidad crítica de que el emisor y el receptor compartan previamente una única clave secreta [137, 325 / pág. 76]. Un criptosistema de clave pública funciona mediante un par de claves matemáticamente vinculadas pero distintas entre sí:'
      },
      {
        type: 'paragraph',
        text: 'Clave Pública: Es una clave que se distribuye abiertamente y está al alcance de cualquier persona [137, 325 / pág. 76]. Se utiliza exclusivamente para cifrar el mensaje antes de enviarlo.'
      },
      {
        type: 'paragraph',
        text: 'Clave Privada: Es una clave que el propietario debe mantener bajo su exclusivo control y en absoluto secreto [137, 325 / pág. 76]. Se utiliza para descifrar los criptogramas generados con su clave pública correspondiente.'
      },
      {
        type: 'paragraph',
        text: 'La relación matemática entre ambas claves está diseñada de tal forma que, aunque un atacante conozca la clave pública y el algoritmo de cifrado, es computacionalmente inviable o extremadamente difícil deducir la clave privada.'
      },
      {
        type: 'paragraph',
        text: 'De esta manera, cualquier persona puede cifrar un mensaje para ti usando tu clave pública, pero solo tú, poseedor de la clave privada, podrás descifrarlo y leer el contenido original [137, 325 / pág. 77].'
      }
    ]
  },
  {
    id: 'entrada2',
    title: 'Funcionamiento y Algoritmos Representativos de Clave Pública',
    subtitle: 'Algoritmos representativos',
    icon: 'assets/icons/algorithm.webp',
    sources: [
      'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
      'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'La fortaleza de la criptografía asimétrica no radica en el secreto de sus procedimientos, sino en la dificultad computacional de problemas matemáticos complejos.'
      },
      {
        type: 'paragraph',
        text: 'Estos algoritmos aprovechan funciones matemáticas que son fáciles de realizar en un sentido, pero sumamente difíciles de revertir sin poseer un dato clave (la clave privada).'
      },
      {
        type: 'paragraph',
        text: 'Protocolo Diffie-Hellman (DH): Publicado en 1976, no es un criptosistema de cifrado de datos directamente, sino un protocolo para acordar una clave simétrica común de forma segura a través de un canal inseguro. Su seguridad se sustenta en la dificultad del problema del logaritmo discreto (DLP) [193, 325 / pág. 77].'
      },
      {
        type: 'paragraph',
        text: 'Criptosistema RSA (Rivest, Shamir y Adleman): Creado en 1977, es el algoritmo de clave pública más extendido a nivel mundial [197, 325 / pág. 79]. Basa su seguridad en la imposibilidad de resolver de forma eficiente la factorización de números enteros extremadamente grandes (un número compuesto n que es el producto de dos primos gigantes p y q) [198, 209, 325 / pág. 79].'
      },
      {
        type: 'paragraph',
        text: 'Criptosistema de ElGamal: Diseñado por Taher ElGamal en 1984, se basa igualmente en el problema del logaritmo discreto [211, 325 / pág. 81]. A diferencia de RSA, el criptograma resultante tiene el doble de tamaño que el mensaje original.'
      },
      {
        type: 'paragraph',
        text: 'Criptografía de Curvas Elípticas (ECC): Utiliza las propiedades algebraicas de los puntos de una curva elíptica sobre un cuerpo finito. Al estar basado en el problema del logaritmo elíptico (mucho más complejo), permite utilizar claves significativamente más pequeñas (por ejemplo, 224 bits de ECC equivalen a 2048 bits de RSA) logrando la misma robustez y una mayor eficiencia de procesamiento.'
      }
    ]
  },
  {
    id: 'entrada3',
    title: 'Criptografía Simétrica vs. Asimétrica: Diferencias y el Modelo Híbrido',
    subtitle: 'Comparación y modelo híbrido',
    icon: 'assets/icons/scales.webp',
    sources: [
      'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
      'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.'
    ],
    content: [
      {
        type: 'table',
        headers: ['Criterio', 'Criptografía Simétrica', 'Criptografía Asimétrica'],
        rows: [
          ['Claves', 'Utiliza una única clave compartida tanto para cifrar como para descifrar [136, 325 / pág. 76].', 'Utiliza un par de claves: una pública para cifrar y una privada para descifrar [137, 325 / pág. 76].'],
          ['Gestión de Claves', 'Compleja a gran escala. Requiere n² claves distintas para canales independientes entre múltiples nodos [325 / pág. 83].', 'Sencilla. Cada usuario solo requiere generar un único par de claves independientemente del número de interlocutores [325 / pág. 83].'],
          ['Velocidad', 'Extremadamente rápida y de bajo consumo computacional [325 / pág. 83].', 'Mucho más lenta debido a la complejidad de las operaciones matemáticas con números gigantes [223, 325 / pág. 83].'],
          ['Tamaño de Claves', 'Cortas (típicamente de 128 o 256 bits) [166, 174, 325 / pág. 83].', 'Largas (mínimo 2048 bits para RSA para ser seguras hoy) [198, 325 / pág. 83].']
        ]
      },
      {
        type: 'paragraph',
        text: 'El Criptosistema Híbrido: Dado que la criptografía simétrica es muy veloz pero tiene problemas para distribuir claves de forma segura, y la asimétrica resuelve la distribución pero es lenta, el desarrollo moderno utiliza sistemas híbridos (como el protocolo HTTPS) [130, 131, 226, 325 / pág. 83, 84]. En este modelo, el cliente y el servidor usan criptografía asimétrica únicamente para negociar y enviarse de forma segura una "clave de sesión" temporal [226, 227, 325 / pág. 84]. Una vez que ambos comparten esa clave secreta, toda la transmisión masiva de datos se realiza bajo criptografía simétrica, logrando un canal rápido y totalmente seguro [227, 228, 325 / pág. 84].'
      }
    ]
  },
  {
    id: 'entrada4',
    title: 'Caso Práctico de Aplicación',
    subtitle: 'Cifrado RSA en JavaScript utilizando la Web Cryptography API',
    icon: 'assets/icons/example.webp',
    sources: [
      'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
      'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.',
      'OWASP Foundation. (2026). Threat Modeling Process (Historical). OWASP Foundation. https://owasp.org/www-community/Threat_Modeling_Process'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Para identificar y aplicar los fundamentos de seguridad dentro del ciclo de vida del desarrollo de software (SDLC) es indispensable llevar la teoría criptográfica a un plano práctico. La Web Cryptography API permite ejecutar operaciones criptográficas seguras en el navegador, incluyendo RSA-OAEP para cifrado asimétrico.'
      },
      {
        type: 'demo',
        module: '../lib/CriptoRSA.js',
        label: 'Texto a cifrar',
        placeholder: 'Escribe el texto para cifrar...',
        example: 'Hola desde la demo',
        buttonText: 'Cifrar y mostrar'
      },
      {
        type: 'code',
        language: 'javascript',
        show: false,
        module: '../lib/CriptoRSA.js'
      },
      {
        type: 'paragraph',
        text: 'Fundamentos de seguridad: el uso de RSA-OAEP con SHA-256 y claves de 2048 bits reduce riesgos criptográficos; además, prácticas de modelado de amenazas (por ejemplo OWASP) ayudan a identificar vectores de divulgación.'
      }
    ]
  },
  {
    id: 'entrada5',
    title: 'Firma Digital, Buenas Prácticas y Recomendaciones de Implementación',
    subtitle: 'Firma digital y recomendaciones',
    icon: 'assets/icons/shield.webp',
    sources: [
      'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
      'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'La seguridad en el desarrollo de software exige que los criptosistemas se implementen siguiendo estrictos estándares internacionales para evitar puertas traseras o fallos críticos en producción.'
      },
      {
        type: 'paragraph',
        text: 'Firma Digital e Importancia: Un beneficio crucial que aporta la criptografía asimétrica es la Firma Digital [236, 325 / pág. 77]. Su funcionamiento es inverso al cifrado confidencial: Se genera un hash o resumen único de longitud fija del documento mediante una función criptográfica (como SHA-256) [229, 239, 325 / pág. 96]. El emisor cifra ese hash con su clave privada [239, 325 / pág. 96]. Este bloque cifrado resultante es la firma digital asociada al documento [239, 325 / pág. 96]. Cualquier receptor puede validar la firma descifrándola con la clave pública del emisor y comparando el hash resultante con el hash generado directamente sobre el documento recibido [240, 325 / pág. 97].'
      },
      {
        type: 'paragraph',
        text: 'La firma digital es de vital importancia en el software moderno porque garantiza tres pilares fundamentales de la seguridad: la autenticidad (quién lo firmó), la integridad de los datos (que no fueron modificados en el camino) y el no repudio (el emisor no puede negar haber firmado el mensaje) [19, 237, 240, 325 / pág. 94].'
      },
      {
        type: 'paragraph',
        text: 'Recomendaciones Clave para el Desarrollador: Principio de Kerckhoffs: Nunca bases la seguridad de tu software en mantener el algoritmo de cifrado en secreto; utiliza estándares públicos validados científicamente y mantén únicamente la clave secreta a salvo. Longitudes de clave seguras: Para el algoritmo RSA, no utilices claves inferiores a 2048 bits [198, 325 / pág. 80]. Si requieres implementaciones eficientes en dispositivos móviles o IoT con bajo poder de procesamiento físico, opta por curvas elípticas (ECC). Utiliza funciones Hash seguras: Al implementar firmas o almacenar contraseñas, evita algoritmos obsoletos como MD5 o SHA-1. Emplea estándares modernos como SHA-256 o superiores [229, 231, 325 / pág. 102].'
      }
    ]
  }
];

export const references = [
  'Hernández Encinas, L. (2016). La criptografía. Editorial CSIC Consejo Superior de Investigaciones Científicas.',
  'Maillo Fernández, J. A. (2017). Sistemas seguros de acceso y transmisión de datos. RA-MA Editorial.'
  , 'OWASP Foundation. (2026). Threat Modeling Process (Historical). OWASP Foundation. https://owasp.org/www-community/Threat_Modeling_Process'
];

// No default export: use named exports `sections` and `references`.
