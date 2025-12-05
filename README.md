# NEXTAPP

## ⚙️ .env Setup

### 🖥️ Backend (/backend)
```env
PORT=5001
DATABASE_URL=your_neon_db_url
NODE_ENV=development
```

### 📱 Mobile App (/mobile)
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🔧 Run the Backend
```bash
cd backend
npm install
npm run dev
```

---

## 📱 Run the Mobile App
```bash
cd mobile
npm install
npx expo start
```

---

💡 **Tip:**  
Certifique-se de que o backend está rodando antes de iniciar o app mobile para que a comunicação entre ambos funcione corretamente.
