/* ============================================================
   Configuração do projecto Firebase — M&E MozCommunity
   ============================================================
   Este é um projecto Firebase NOVO e SEPARADO do "mdr-mozcommunity".

   1. Crie um projecto gratuito em https://console.firebase.google.com
      (ex: nome "me-mozcommunity")
   2. Adicione uma "aplicação Web" ao projecto (ícone </>)
   3. Copie os valores fornecidos e substitua-os abaixo
   4. Active o Firestore Database (modo produção) em:
      Compilação → Firestore Database → Criar base de dados
   5. Active a Autenticação por Email/Password em:
      Compilação → Authentication → Sign-in method → Email/Password
   6. Crie o primeiro utilizador administrador em:
      Compilação → Authentication → Users → Adicionar utilizador
   7. Aplique as regras de segurança do ficheiro firestore.rules
   8. Crie manualmente o teu primeiro perfil "admin" na colecção
      "admins" (ver README.md, secção "Arranque inicial")
   ============================================================ */

const firebaseConfig = {
  apiKey: "COLOQUE_AQUI_A_SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxx",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
