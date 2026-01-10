# Documentatie Frontend - BallTogether

## 1. Informatii Generale

| Caracteristica | Detalii |
|----------------|---------|
| **Nume Proiect** | BallTogether - Frontend |
| **Versiune** | 0.1.0 |
| **Tehnologie** | React 19.2.0 cu TypeScript |
| **Autor** | Avram Sorin-Alexandru |
| **Data** | Ianuarie 2026 |

---

## 2. Tehnologii Utilizate

### 2.1 Dependente Principale

| Pachet | Versiune | Scop |
|--------|----------|------|
| `react` | 19.2.0 | Biblioteca principala pentru UI |
| `react-dom` | 19.2.0 | Randare DOM pentru React |
| `react-router-dom` | 7.9.5 | Navigare intre pagini (SPA) |
| `react-datepicker` | 9.1.0 | Selector de data/ora pentru rezervari |
| `react-leaflet` | 5.0.0 | Harti interactive OpenStreetMap |
| `typescript` | 4.9.5 | Tipare statice pentru JavaScript |
| `leaflet` | (peer) | Motor de harti pentru react-leaflet |

### 2.2 Dependente de Dezvoltare

| Pachet | Scop |
|--------|------|
| `@types/react` | Tipuri TypeScript pentru React |
| `@types/leaflet` | Tipuri TypeScript pentru Leaflet |
| `@testing-library/react` | Testing unitare componente |
| `react-scripts` | Configurare Create React App |

---

## 3. Structura Proiectului

```
frontend/
├── public/
│   ├── index.html          # Template HTML principal
│   ├── manifest.json       # Manifest PWA
│   └── robots.txt          # Configurare crawleri
│
├── src/
│   ├── assets/
│   │   ├── basketball_field.jpg
│   │   ├── footbal_field.jpg
│   │   └── tennis_field.jpg
│   ├── AdminPage.css
│   ├── AdminPage.tsx
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── BookingPage.css
│   ├── BookingPage.tsx
│   ├── Dashboard.css
│   ├── Dashboard.tsx
│   ├── FieldCard.tsx
│   ├── FieldPage.tsx
│   ├── FieldsPage.css
│   ├── Footer.css
│   ├── Footer.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── LandingPage.css
│   ├── LandingPage.tsx
│   ├── layout.css
│   ├── LoginPage.css
│   ├── LoginPage.tsx
│   ├── logo.svg
│   ├── Navbar.css
│   ├── Navbar.tsx
│   ├── react-app-env.d.ts
│   ├── RefereeCard.tsx
│   ├── RefereesPage.css
│   ├── RefereesPage.tsx
│   ├── reportWebVitals.ts
│   └── setupTests.ts
│
├── .gitignore
├── DOCUMENTATIE_FRONTEND.md
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

**Nota:** Toate fisierele sursa (.tsx, .css) sunt direct in folderul `src/`. Singurul subfolder este `assets/` care contine imaginile terenurilor.

---

## 4. Sistem de Rutare

Aplicatia foloseste `react-router-dom` pentru navigare SPA (Single Page Application):

| Ruta | Componenta | Descriere | Acces |
|------|------------|-----------|-------|
| `/` | `LandingPage` | Pagina principala | Public |
| `/login` | `LoginPage` | Autentificare/Inregistrare | Public |
| `/fields` | `FieldsPage` | Lista terenurilor + harta | Public |
| `/book/:id` | `BookingPage` | Rezervare teren specific | Autentificat |
| `/dashboard` | `Dashboard` | Panou utilizator | Autentificat |
| `/referees` | `RefereesPage` | Lista arbitrilor | Public |
| `/admin` | `AdminPage` | Panou administrare | Admin |

### 4.1 Implementare Routing (App.tsx)

```tsx
<Router>
  <Navbar />
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/fields" element={<FieldsPage />} />
    <Route path="/book/:id" element={<BookingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/referees" element={<RefereesPage />} />
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
  <Footer />
</Router>
```

---

## 5. Descrierea Componentelor

### 5.1 LandingPage.tsx
**Scop:** Pagina de start a aplicatiei

**Functionalitati:**
- Sectiune Hero cu mesaj de bun venit
- Statistici (numar terenuri, jucatori, arbitri)
- Sectiune "How It Works" (4 pasi)
- Lista de terenuri populare
- Butoane CTA (Call-to-Action)

**State:** Fara state (componenta statica)

---

### 5.2 LoginPage.tsx
**Scop:** Autentificare si inregistrare utilizatori

**Functionalitati:**
- Formular dual: Login / Register (toggle)
- Validare client-side (email, parola, confirmare)
- Comunicare cu backend-ul via REST API
- Stocare date utilizator in `localStorage`

**State:**
```tsx
const [isLogin, setIsLogin] = useState(true);
const [formData, setFormData] = useState({
  fullName: '', email: '', password: '', confirmPassword: ''
});
const [error, setError] = useState('');
```

**API Endpoints:**
- `POST /api/users/register` - Inregistrare
- `POST /api/users/login` - Autentificare

**Stocare Sesiune:**
```tsx
localStorage.setItem('user', JSON.stringify({
  id, email, fullName, role
}));
localStorage.setItem('userId', id);
localStorage.setItem('userEmail', email);
localStorage.setItem('userName', fullName);
```

---

### 5.3 FieldsPage.tsx (FieldPage.tsx)
**Scop:** Afisare terenuri sportive cu harta interactiva

**Functionalitati:**
- Harta OpenStreetMap cu markeri pentru fiecare teren
- Lista de carduri terenuri (grid)
- Afisare sporturi disponibile per teren
- Click pe card → navigare la BookingPage

**State:**
```tsx
const [fields, setFields] = useState<FieldData[]>([]);
const [loading, setLoading] = useState(true);
```

**Interfata Date:**
```tsx
interface FieldData {
  id: number;
  name: string;
  address: string;
  price: number;
  players: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  sports?: { id: number; name: string }[];
}
```

**API Endpoint:**
- `GET /api/locations` - Lista terenuri

---

### 5.4 BookingPage.tsx
**Scop:** Rezervare teren cu selectare optionala arbitru

**Functionalitati:**
- Afisare detalii teren selectat
- Selector data/ora start si end
- Afisare sloturi ocupate
- Selectare sport din lista disponibila
- **Incarcare dinamica arbitri disponibili** (bazat pe interval orar)
- Calcul pret total (teren + arbitru optional)
- Confirmare rezervare cu verificare suprapunere

**State Principal:**
```tsx
const [location, setLocation] = useState<LocationData | null>(null);
const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
const [referees, setReferees] = useState<Referee[]>([]);
const [selectedRefereeId, setSelectedRefereeId] = useState<number | null>(null);
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [selectedSport, setSelectedSport] = useState('');
const [totalPrice, setTotalPrice] = useState(0);
```

**API Endpoints:**
- `GET /api/locations/:id` - Detalii teren
- `GET /api/bookings/occupied/:id` - Sloturi ocupate
- `GET /api/referees/available?startTime=...&endTime=...` - Arbitri disponibili
- `POST /api/bookings/confirm` - Confirmare rezervare

---

### 5.5 Dashboard.tsx
**Scop:** Panoul utilizatorului pentru gestionarea evenimentelor

**Functionalitati:**
- Afisare evenimente utilizator (ca host, participant, sau arbitru)
- **Sistem de invitatii** - trimitere invitatie prin email
- Afisare detalii eveniment (locatie, sport, participanti, arbitru)
- Status eveniment (PLANNED, IN_PROGRESS, COMPLETED)

**State:**
```tsx
const [events, setEvents] = useState<Event[]>([]);
const [loading, setLoading] = useState(true);
const [inviteEmail, setInviteEmail] = useState('');
const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
```

**Interfata Event:**
```tsx
interface Event {
  id: number;
  host: { id, email, fullName };
  location: { id, name, address };
  sport: { id, name } | null;
  startTime: string;
  endTime: string;
  status: string;
  participants?: any[];
  referee?: { id, bio, ratePerHour, user } | null;
}
```

**API Endpoints:**
- `GET /api/events/user/:userId` - Evenimente utilizator
- `POST /api/events/:eventId/invite` - Trimitere invitatie

---

### 5.6 RefereesPage.tsx
**Scop:** Afisare lista arbitri disponibili

**Functionalitati:**
- Incarcare dinamica arbitri din backend
- Afisare carduri cu: foto, nume, sporturi, bio, tarif
- State loading si empty

**State:**
```tsx
const [referees, setReferees] = useState<Referee[]>([]);
const [loading, setLoading] = useState(true);
```

**API Endpoint:**
- `GET /api/referees` - Lista arbitri

---

### 5.7 AdminPage.tsx
**Scop:** Panou administrare complet CRUD

**Functionalitati:**
- **4 Tab-uri:** Users, Events, Referees, Locations
- **Verificare rol Admin** la incarcare
- **CRUD Utilizatori:** vizualizare, schimbare rol, stergere
- **CRUD Evenimente:** vizualizare, adaugare/stergere participanti, stergere
- **CRUD Arbitri:** adaugare (selectare user + sporturi), stergere
- **CRUD Locatii:** adaugare (cu sporturi), stergere
- Cautare in liste
- Modals pentru adaugare entitati

**State Complex:**
```tsx
const [activeTab, setActiveTab] = useState<TabType>('users');
const [users, setUsers] = useState<User[]>([]);
const [events, setEvents] = useState<Event[]>([]);
const [referees, setReferees] = useState<Referee[]>([]);
const [locations, setLocations] = useState<Location[]>([]);
const [sports, setSports] = useState<Sport[]>([]);
// + forme pentru modals
```

**API Endpoints Admin:**
- `GET/DELETE /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `GET/DELETE /api/admin/events`
- `POST/DELETE /api/admin/events/:id/participants`
- `GET/POST/DELETE /api/admin/referees`
- `GET/POST/DELETE /api/admin/locations`

---

### 5.8 Navbar.tsx
**Scop:** Bara de navigare globala

**Functionalitati:**
- Logo + link-uri navigare
- **Afisare conditionala** bazata pe stare autentificare
- Buton Login/Logout
- Link Admin (doar pentru utilizatori Admin)

**Logica Autentificare:**
```tsx
const userStr = localStorage.getItem('user');
let isAdmin = false;
let isLoggedIn = false;

if (userStr) {
  const user = JSON.parse(userStr);
  isAdmin = user.role === 'Admin';
  isLoggedIn = true;
}
```

---

### 5.9 FieldCard.tsx
**Scop:** Componenta reutilizabila pentru afisare teren

**Props:**
```tsx
interface FieldProps {
  id: number;
  name: string;
  address: string;
  price: number;
  players: number;
  type: string;
  imageUrl: string;
  sports?: { id: number; name: string }[];
}
```

**Functionalitati:**
- Imagine dinamica din baza de date
- Badge tip teren
- Afisare sporturi disponibile ca tag-uri
- Buton "Book Now" → navigare la `/book/:id`

---

## 6. Gestionarea Starii

### 6.1 State Local (useState)
Fiecare componenta gestioneaza propriul state folosind `useState` hook:
- **Loading states** - pentru afisare spinners
- **Form data** - pentru formulare
- **Entity lists** - pentru date de la API

### 6.2 Persistenta Datelor (localStorage)
```tsx
// Stocare la login
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('userId', id);
localStorage.setItem('userEmail', email);
localStorage.setItem('userName', fullName);

// Citire
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Stergere la logout
localStorage.removeItem('user');
localStorage.removeItem('userId');
// etc.
```

---

## 7. Comunicare cu Backend-ul

### 7.1 Configurare API
- **Base URL:** `http://localhost:8080`
- **Format:** JSON
- **Metode:** GET, POST, PUT, DELETE

### 7.2 Pattern Fetch Standard
```tsx
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:8080/api/endpoint');
    if (response.ok) {
      const data = await response.json();
      setData(data);
    } else {
      const errorMsg = await response.text();
      setError(errorMsg);
    }
  } catch (err) {
    console.error('Error:', err);
    setError('Could not connect to server');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, [dependency]);
```

### 7.3 Pattern POST Standard
```tsx
const handleSubmit = async () => {
  const response = await fetch('http://localhost:8080/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (response.ok) {
    // Success handling
  } else {
    const error = await response.text();
    // Error handling
  }
};
```

---

## 8. Stilizare CSS

### 8.1 Conventii Utilizate
- **Clase BEM-like:** `.component-element`
- **Layout:** Flexbox si CSS Grid
- **Responsive:** Media queries pentru mobile
- **Variabile:** Culori si spatiere consistente

### 8.2 Teme de Culori Principale
```css
/* Culorile principale ale aplicatiei */
--primary-green: #22c55e;
--primary-dark: #1a1a2e;
--text-light: #ffffff;
--text-muted: #888;
--card-bg: #2a2a4a;
--error-red: #ef4444;
--success-green: #10b981;
```

---

## 9. Comenzi Disponibile

```bash
# Instalare dependente
npm install

# Pornire server dezvoltare (port 3000)
npm start

# Build pentru productie
npm run build

# Rulare teste
npm test

# Ejectare configuratie (ireversibil)
npm run eject
```

---

## 10. Configurare si Pornire

### 10.1 Cerinte Prealabile
- Node.js >= 16.x
- npm >= 8.x
- Backend Spring Boot ruland pe portul 8080

### 10.2 Pasi Instalare
```bash
cd frontend
npm install
npm start
```

Aplicatia va fi disponibila la: `http://localhost:3000`

---

## 11. Fluxuri Utilizator

### 11.1 Flux Inregistrare + Login
1. Utilizator acceseaza `/login`
2. Toggle la "Create Account"
3. Completeaza: Full Name, Email, Password, Confirm Password
4. Submit → `POST /api/users/register`
5. Succes → Toggle la Login
6. Completeaza credentiale → `POST /api/users/login`
7. Succes → Redirect la `/dashboard`

### 11.2 Flux Rezervare Teren
1. Utilizator navigheaza la `/fields`
2. Vizualizeaza terenuri pe harta si in grid
3. Click "Book Now" pe un teren → `/book/:id`
4. Selecteaza data/ora start si end
5. (Optional) Selecteaza arbitru din lista disponibila
6. Vizualizeaza pret total
7. Click "Confirm Booking" → `POST /api/bookings/confirm`
8. Succes → Redirect la `/dashboard`

### 11.3 Flux Invitare Participanti
1. Utilizator pe `/dashboard`
2. Vizualizeaza evenimentele proprii
3. Click pe input invitatie pentru un eveniment
4. Introduce email participant
5. Click "Invite" → `POST /api/events/:id/invite`
6. Succes → Lista participanti actualizata

---

## 12. Diagrama Componentelor

```
                    ┌─────────────────┐
                    │    App.tsx      │
                    │   (Router)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼─────┐       ┌─────▼─────┐
    │ Navbar  │        │   Main    │       │  Footer   │
    │  .tsx   │        │  Routes   │       │   .tsx    │
    └─────────┘        └─────┬─────┘       └───────────┘
                             │
    ┌────────────────────────┼────────────────────────┐
    │           │            │            │           │
┌───▼───┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐ ┌────▼────┐
│Landing│  │ Fields  │  │Booking │  │Dashboard│ │  Admin  │
│ Page  │  │  Page   │  │  Page  │  │         │ │  Page   │
└───────┘  └────┬────┘  └────────┘  └─────────┘ └─────────┘
                │
           ┌────▼────┐
           │FieldCard│
           └─────────┘
```

---

## 13. Concluzii

Frontend-ul BallTogether este o aplicatie React moderna care ofera:
- **Interfata intuitiva** pentru rezervarea terenurilor sportive
- **Harta interactiva** pentru localizarea terenurilor
- **Sistem de autentificare** complet
- **Panou de administrare** pentru gestionarea entitatilor
- **Design responsiv** adaptat pentru dispozitive mobile
- **Integrare completa** cu backend-ul Spring Boot via REST API