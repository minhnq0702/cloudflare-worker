// function buf2hex(buffer: ArrayBuffer) {
//   return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
// }

// async function hashPassword(password: string) {
//   const key = await crypto.subtle.importKey(
//     "raw",
//     crypto.getRandomValues(new Uint8Array(16)),
//     {
//         name: "PBKDF2",
//     },
//     false,
//     ["deriveKey", "deriveBits"]
//   )

//   const resp = await crypto.subtle.deriveBits(
//     {
//       name: "PBKDF2",
//       salt: crypto.getRandomValues(new Uint8Array(16)),
//       iterations: 600000,
//       hash: { name: "SHA-512" },
//     },
//     key,
//     256
//   );

//   return buf2hex(resp);
// }

import * as nodeCrypto from 'node:crypto';

function hashPassword(password: string): Promise<string> {
  const salt = nodeCrypto.randomBytes(16).toString('base64');

  return new Promise((resolve, reject) => {
    const iterations = 150000;
    const keylen = 64; // 64 bytes = 512 bits
    const digest = 'sha512';

    nodeCrypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) reject(err);
      const hash = `$pbkdf2-sha512$${iterations}$${salt}$${derivedKey.toString('base64')}`;
      // resolve(derivedKey.toString('base64'));
      resolve(hash);
    });
  });
}


// async function hashPassword(password: string) {
//   // const salt = 'mySalt';
//   const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
//   const encoder = new TextEncoder();
//   const passwordBuffer = encoder.encode(password);
//   // const saltBuffer = encoder.encode(salt);

//   // Import the password as a key
//   const keyMaterial = await crypto.subtle.importKey(
//     'raw',
//     passwordBuffer,
//     { name: 'PBKDF2' },
//     false,
//     ['deriveBits', 'deriveKey']
//   );

//   // Derive a key from the password
//   const key = await crypto.subtle.deriveKey(
//     {
//       name: 'PBKDF2',
//       salt: saltBuffer,
//       iterations: 600000,
//       hash: 'SHA-512'
//     },
//     keyMaterial,
//     { name: 'AES-GCM', length: 256 },
//     true,
//     ['encrypt', 'decrypt']
//   );

//   // Export the key to get the hash
//   const exported = await crypto.subtle.exportKey('raw', key);
//   const hashBuffer = new Uint8Array(exported as ArrayBuffer);
//   const hashArray = Array.from(hashBuffer);
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

//   return hashHex;
// }
  
export default hashPassword;