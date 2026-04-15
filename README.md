# Real Estate Blockchain System

Ushbu loyiha ko'chmas mulk savdosi uchun blockchain yechimidir.

## Asosiy imkoniyatlar

- Ko'chmas mulkni ro'yxatdan o'tkazish (`uy`, `yer`, `ofis`)
- Mulk egasini tekshirish
- Mulkni boshqa egaga o'tkazish (transfer)
- Mulk hujjatlari hashlarini blockchain'da saqlash
- Mulk ma'lumotlariga kim kira olishini boshqarish
- Mulkning to'liq transfer tarixini ko'rsatish

## Texnologiyalar

- Smart contract: Solidity + Hardhat
- Backend: Node.js + Express + Ethers
- Frontend: HTML/CSS/JS

## Loyiha tuzilmasi

- `contracts/RealEstateRegistry.sol` - asosiy smart contract
- `scripts/deploy.js` - deploy script
- `backend/src/index.js` - REST API
- `frontend/` - oddiy UI

## Local ishga tushirish

1. Smart contract dependency o'rnatish:

```bash
npm install
```

2. Local blockchain ishga tushirish:

```bash
npm run node
```

3. Yangi terminalda contract deploy qilish:

```bash
npm run deploy:local
```

4. `.env.example` ni `.env` ga nusxalang va `CONTRACT_ADDRESS` ni deploy bo'lgan contract address bilan to'ldiring.

5. Backend dependency o'rnatish:

```bash
cd backend
npm install
npm start
```

6. Frontend ochish:

- `frontend/index.html` faylini browserda oching
- yoki oddiy static server orqali servis qiling

## Sepolia ga deploy

1. `.env` faylga to'ldiring:
   - `SEPOLIA_RPC_URL`
   - `PRIVATE_KEY`
2. Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## GitHub ga joylash

```bash
git init
git add .
git commit -m "Initial real estate blockchain project"
git branch -M main
git remote add origin https://github.com/odilbek315/real-estate-blockchain-system.git
git push -u origin main
```

## Free serverlarga deploy

### 1) Smart Contract
- Sepolia testnet (tekin)

### 2) Backend (Render yoki Railway)
- `backend` papkani Render/Railway ga ulang
- Start command: `npm start`
- Environment variables:
  - `RPC_URL` (masalan, Sepolia RPC)
  - `PRIVATE_KEY`
  - `CONTRACT_ADDRESS`
  - `PORT`

### 3) Frontend (Vercel yoki Netlify)
- `frontend` papkani deploy qiling
- `app.js` dagi `API_URL` ni backend URL ga almashtiring

## Eslatma

- Hujjatning o'zi emas, uning hash'i blockchain'ga yoziladi.
- Real loyiha uchun wallet auth (MetaMask), role-based access va IPFS integratsiya qo'shish tavsiya etiladi.
