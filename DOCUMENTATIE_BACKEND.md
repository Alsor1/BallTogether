# Documentatie Backend - BallTogether

## Cuprins
1. [Informatii Generale](#1-informatii-generale)
2. [Tehnologii si Dependente](#2-tehnologii-si-dependente)
3. [Configurare Proiect](#3-configurare-proiect)
4. [Structura Proiectului](#4-structura-proiectului)
5. [Entitati JPA (Modele de Date)](#5-entitati-jpa-modele-de-date)
6. [Diagrama Relatii Baza de Date](#6-diagrama-relatii-baza-de-date)
7. [Repositories (Acces la Date)](#7-repositories-acces-la-date)
8. [Servicii (Business Logic)](#8-servicii-business-logic)
9. [Controllere REST API](#9-controllere-rest-api)
10. [Configurare Securitate](#10-configurare-securitate)
11. [Comunicare cu Frontend-ul](#11-comunicare-cu-frontend-ul)
12. [Rulare si Build](#12-rulare-si-build)

---

## 1. Informatii Generale

**Nume Proiect:** BallTogether Backend  
**Tip Aplicatie:** API REST Spring Boot  
**Versiune Spring Boot:** 3.5.7  
**Versiune Java:** 17  
**Port Server:** 8080  
**Baza de Date:** PostgreSQL  

### Descriere
Backend-ul aplicatiei BallTogether este un server REST API construit cu Spring Boot care gestioneaza:
- Autentificarea si gestionarea utilizatorilor
- Rezervarea terenurilor sportive
- Gestionarea evenimentelor sportive
- Sistemul de arbitri
- Panoul de administrare

---

## 2. Tehnologii si Dependente

### Framework Principal
| Tehnologie | Versiune | Descriere |
|------------|----------|-----------|
| Spring Boot | 3.5.7 | Framework principal pentru aplicatii Java |
| Java | 17 | Limbajul de programare |
| Maven | - | Gestionar dependente si build |

### Dependente (pom.xml)

```xml
<!-- Spring Boot Starters -->
spring-boot-starter-data-jpa     → JPA/Hibernate pentru acces baza de date
spring-boot-starter-security     → Spring Security pentru autentificare
spring-boot-starter-web          → REST API si server web

<!-- Baza de Date -->
postgresql                       → Driver PostgreSQL

<!-- Utilitare -->
lombok                          → Reducerea codului boilerplate
spring-boot-starter-test        → Testing framework
```

### Descrierea Dependentelor

| Dependenta | Rol |
|------------|-----|
| `spring-boot-starter-data-jpa` | ORM Hibernate, JPA Repositories, JPQL Queries |
| `spring-boot-starter-security` | BCrypt password encoding, CORS configuration |
| `spring-boot-starter-web` | REST controllers, JSON serialization, Tomcat server |
| `postgresql` | Conexiune la baza de date PostgreSQL |
| `lombok` | @Getter, @Setter, @NoArgsConstructor - reduce boilerplate |

---

## 3. Configurare Proiect

### application.properties

```properties
# Configurare Server
server.port=8080

# Configurare PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/balltogether
spring.datasource.username=postgres
spring.datasource.password=1234

# Configurare JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
```

### Explicatii Configurare

| Proprietate | Valoare | Descriere |
|-------------|---------|-----------|
| `server.port` | 8080 | Portul pe care ruleaza serverul |
| `datasource.url` | jdbc:postgresql://localhost:5432/balltogether | URL-ul bazei de date |
| `ddl-auto` | update | Actualizeaza automat schema bazei de date |
| `show-sql` | true | Afiseaza query-urile SQL in consola |
| `dialect` | PostgreSQLDialect | Dialectul SQL specific PostgreSQL |

---

## 4. Structura Proiectului

```
backend/
├── pom.xml                           # Configurare Maven si dependente
├── mvnw / mvnw.cmd                   # Maven Wrapper
└── src/
    ├── main/
    │   ├── java/com/balltogether/backend/
    │   │   ├── BackendApplication.java    # Clasa principala
    │   │   ├── config/
    │   │   │   └── SecurityConfig.java    # Configurare securitate
    │   │   ├── controller/
    │   │   │   ├── AdminController.java   # Endpoint-uri admin
    │   │   │   ├── BookingController.java # Endpoint-uri rezervari
    │   │   │   ├── EventController.java   # Endpoint-uri evenimente
    │   │   │   ├── LocationController.java# Endpoint-uri locatii
    │   │   │   ├── RefereeController.java # Endpoint-uri arbitri
    │   │   │   └── UserController.java    # Endpoint-uri utilizatori
    │   │   ├── dto/
    │   │   │   ├── BookingRequest.java    # DTO pentru rezervari
    │   │   │   ├── LoginRequest.java      # DTO pentru login
    │   │   │   ├── RefereeDTO.java        # DTO pentru arbitri
    │   │   │   └── ...
    │   │   ├── entity/
    │   │   │   ├── Booking.java           # Entitate rezervare
    │   │   │   ├── Event.java             # Entitate eveniment
    │   │   │   ├── Location.java          # Entitate locatie
    │   │   │   ├── Referee.java           # Entitate arbitru
    │   │   │   ├── Sport.java             # Entitate sport
    │   │   │   └── Users.java             # Entitate utilizator
    │   │   ├── repository/
    │   │   │   ├── BookingRepository.java
    │   │   │   ├── EventRepository.java
    │   │   │   ├── LocationRepository.java
    │   │   │   ├── RefereeRepository.java
    │   │   │   ├── SportRepository.java
    │   │   │   └── UserRepository.java
    │   │   └── service/
    │   │       └── EventService.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/...                       # Teste unitare
```

---

## 5. Entitati JPA (Modele de Date)

### 5.1 Users (Utilizatori)

**Fisier:** `entity/Users.java`  
**Tabel:** `users`

```java
@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(nullable = false)
    private String role;  // "User", "Admin", "Referee"
}
```

| Camp | Tip | Descriere |
|------|-----|-----------|
| `id` | Long | ID unic, auto-generat |
| `fullName` | String | Numele complet |
| `email` | String | Email unic (folosit la login) |
| `passwordHash` | String | Parola criptata BCrypt |
| `role` | String | Rolul: "User", "Admin", "Referee" |

---

### 5.2 Event (Evenimente)

**Fisier:** `entity/Event.java`  
**Tabel:** `events`

```java
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "host_user_id")
    private Users host;

    @ManyToMany
    @JoinTable(
        name = "event_participants",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<Users> participants;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private Sport sport;

    @ManyToOne
    @JoinColumn(name = "referee_id")
    private Referee referee;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;  // "PLANNED", "CONFIRMED", "IN_PROGRESS", "COMPLETED"
}
```

| Camp | Tip | Relatie | Descriere |
|------|-----|---------|-----------|
| `id` | Long | - | ID unic |
| `host` | Users | @ManyToOne | Gazda evenimentului |
| `participants` | Set<Users> | @ManyToMany | Participantii |
| `location` | Location | @ManyToOne | Terenul rezervat |
| `sport` | Sport | @ManyToOne | Sportul jucat |
| `referee` | Referee | @ManyToOne | Arbitrul (optional) |
| `startTime` | LocalDateTime | - | Ora de inceput |
| `endTime` | LocalDateTime | - | Ora de sfarsit |
| `status` | String | - | Statusul evenimentului |

---

### 5.3 Location (Locatii/Terenuri)

**Fisier:** `entity/Location.java`  
**Tabel:** `locations`

```java
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(name = "price_per_hour")
    private Double price;

    @Column(name = "capacity")
    private Integer players;

    private Double latitude;
    private Double longitude;
    private String imageUrl;

    @ManyToMany
    @JoinTable(
        name = "location_sports",
        joinColumns = @JoinColumn(name = "location_id"),
        inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<Sport> sports;
}
```

| Camp | Tip | Descriere |
|------|-----|-----------|
| `id` | Long | ID unic |
| `name` | String | Numele terenului |
| `address` | String | Adresa completa |
| `price` | Double | Pretul pe ora |
| `players` | Integer | Capacitatea maxima |
| `latitude/longitude` | Double | Coordonate GPS (pentru harta) |
| `imageUrl` | String | URL imagine |
| `sports` | Set<Sport> | Sporturile disponibile |

---

### 5.4 Booking (Rezervari)

**Fisier:** `entity/Booking.java`  
**Tabel:** `bookings`

```java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "payer_user_id")
    private Users payer;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "payment_status")
    private String paymentStatus;  // "PENDING", "CONFIRMED"

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

| Camp | Tip | Descriere |
|------|-----|-----------|
| `id` | Long | ID unic |
| `event` | Event | Evenimentul asociat (OneToOne) |
| `payer` | Users | Utilizatorul care plateste |
| `totalAmount` | BigDecimal | Suma totala |
| `paymentStatus` | String | Statusul platii |
| `createdAt` | LocalDateTime | Data crearii |

---

### 5.5 Referee (Arbitri)

**Fisier:** `entity/Referee.java`  
**Tabel:** `referees`

```java
@Entity
@Table(name = "referees")
public class Referee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private String bio;

    @Column(name = "rate_per_hour")
    private BigDecimal ratePerHour;

    private String imageUrl;

    @ManyToMany
    @JoinTable(
        name = "referee_sports",
        joinColumns = @JoinColumn(name = "referee_id"),
        inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<Sport> sports;
}
```

| Camp | Tip | Descriere |
|------|-----|-----------|
| `id` | Long | ID unic |
| `user` | Users | Contul de utilizator asociat |
| `bio` | String | Biografia/descrierea |
| `ratePerHour` | BigDecimal | Tariful pe ora |
| `imageUrl` | String | URL-ul imaginii de profil |
| `sports` | Set<Sport> | Sporturile la care arbitreaza |

---

### 5.6 Sport (Sporturi)

**Fisier:** `entity/Sport.java`  
**Tabel:** `sports`

```java
@Entity
@Table(name = "sports")
public class Sport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
```

| Camp | Tip | Descriere |
|------|-----|-----------|
| `id` | Long | ID unic |
| `name` | String | Numele sportului (Fotbal, Tenis, etc.) |

---

## 6. Diagrama Relatii Baza de Date

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         DIAGRAMA RELATII BAZA DE DATE                            │
└──────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐          ┌─────────────────┐          ┌─────────────┐
    │   SPORTS    │◄────────►│ LOCATION_SPORTS │◄────────►│  LOCATIONS  │
    │─────────────│          │  (Join Table)   │          │─────────────│
    │ id          │          │ location_id     │          │ id          │
    │ name        │          │ sport_id        │          │ name        │
    └──────┬──────┘          └─────────────────┘          │ address     │
           │                                               │ price       │
           │                                               │ players     │
           │          ┌─────────────────┐                  │ lat/lng     │
           ├─────────►│ REFEREE_SPORTS  │                  └──────┬──────┘
           │          │  (Join Table)   │                         │
           │          │ referee_id      │                         │
           │          │ sport_id        │                         │
           │          └────────┬────────┘                         │
           │                   │                                  │
           │                   ▼                                  │
           │          ┌─────────────┐                             │
           │          │  REFEREES   │                             │
           │          │─────────────│                             │
           │          │ id          │                             │
           │          │ user_id (FK)│──────┐                      │
           │          │ bio         │      │                      │
           │          │ ratePerHour │      │                      │
           │          └──────┬──────┘      │                      │
           │                 │             │                      │
           ▼                 │             ▼                      │
    ┌─────────────┐          │      ┌─────────────┐               │
    │   EVENTS    │◄─────────┘      │    USERS    │               │
    │─────────────│                 │─────────────│               │
    │ id          │◄────────────────│ id          │               │
    │ host_user_id│                 │ fullName    │               │
    │ location_id │◄────────────────│ email       │               │
    │ sport_id    │                 │ passwordHash│               │
    │ referee_id  │                 │ role        │               │
    │ startTime   │                 └──────┬──────┘               │
    │ endTime     │                        │                      │
    │ status      │                        │                      │
    └──────┬──────┘                        │                      │
           │                               │                      │
           │     ┌──────────────────┐      │                      │
           ├────►│ EVENT_PARTICIPANTS│◄────┘                      │
           │     │   (Join Table)   │                             │
           │     │ event_id         │                             │
           │     │ user_id          │                             │
           │     └──────────────────┘                             │
           │                                                      │
           ▼                                                      │
    ┌─────────────┐                                               │
    │  BOOKINGS   │                                               │
    │─────────────│                                               │
    │ id          │                                               │
    │ event_id    │───────────────────────────────────────────────┘
    │ payer_user_id
    │ totalAmount │
    │ paymentStatus
    │ createdAt   │
    └─────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                              LEGENDA RELATII                                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│  Users 1:N Events (host)              │  Users N:M Events (participants)        │
│  Users 1:1 Referee                    │  Events 1:1 Booking                     │
│  Locations N:M Sports                 │  Referees N:M Sports                    │
│  Events N:1 Location                  │  Events N:1 Sport                       │
│  Events N:1 Referee                   │  Bookings N:1 Users (payer)             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Repositories (Acces la Date)

### 7.1 UserRepository

**Fisier:** `repository/UserRepository.java`

```java
@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}
```

| Metoda | Descriere |
|--------|-----------|
| `findAll()` | Toti utilizatorii (mostenit) |
| `findById(Long id)` | Utilizator dupa ID (mostenit) |
| `findByEmail(String email)` | Utilizator dupa email |
| `save(Users user)` | Salveaza utilizator (mostenit) |
| `deleteById(Long id)` | Sterge utilizator (mostenit) |

---

### 7.2 EventRepository

**Fisier:** `repository/EventRepository.java`

```java
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Query-uri JPQL pentru evenimente
    @Query("SELECT e FROM Event e WHERE e.host.id = :hostId")
    List<Event> findByHostId(@Param("hostId") Long hostId);
    
    @Query("SELECT e FROM Event e WHERE e.host.email = :email")
    List<Event> findByHostEmail(@Param("email") String email);
    
    // Evenimente unde utilizatorul este Gazda, Participant SAU Arbitru
    @Query("SELECT DISTINCT e FROM Event e " +
           "LEFT JOIN FETCH e.participants p " +
           "LEFT JOIN FETCH e.referee r " +
           "WHERE e.host.id = :userId " +
           "OR :userId IN (SELECT p.id FROM e.participants p) " +
           "OR (e.referee IS NOT NULL AND e.referee.user.id = :userId)")
    List<Event> findAllRelatedToUser(@Param("userId") Long userId);
    
    // Verificare suprapunere pentru locatie
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
           "WHERE e.location.id = :locationId " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    boolean existsOverlappingEvent(Long locationId, LocalDateTime startTime, LocalDateTime endTime);
    
    // Verificare suprapunere pentru arbitru
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
           "WHERE e.referee.id = :refereeId " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    boolean existsOverlappingEventForReferee(Long refereeId, LocalDateTime startTime, LocalDateTime endTime);
    
    // Gaseste arbitrii ocupati intr-un interval
    @Query("SELECT DISTINCT e.referee.id FROM Event e " +
           "WHERE e.referee IS NOT NULL " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    List<Long> findBusyRefereeIds(LocalDateTime startTime, LocalDateTime endTime);
}
```

---

### 7.3 LocationRepository

**Fisier:** `repository/LocationRepository.java`

```java
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    // Incarca locatiile cu sporturile asociate (evita N+1 problem)
    @Query("SELECT DISTINCT l FROM Location l LEFT JOIN FETCH l.sports")
    List<Location> findAllLocationsNative();
    
    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.sports WHERE l.id = :id")
    Optional<Location> findByIdNative(@Param("id") Long id);
}
```

---

### 7.4 RefereeRepository

**Fisier:** `repository/RefereeRepository.java`

```java
@Repository
public interface RefereeRepository extends JpaRepository<Referee, Long> {
    
    @Query("SELECT r FROM Referee r WHERE r.user.id = :userId")
    Optional<Referee> findByUserId(@Param("userId") Long userId);
}
```

---

### 7.5 BookingRepository

**Fisier:** `repository/BookingRepository.java`

```java
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Insert event cu native query
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO events (...) VALUES (...)", nativeQuery = true)
    void insertEventNative(...);
    
    // Insert booking cu native query
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO bookings (...) VALUES (...)", nativeQuery = true)
    void insertBookingNative(...);
}
```

---

### 7.6 SportRepository

**Fisier:** `repository/SportRepository.java`

```java
@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    // Foloseste metodele mostenite de la JpaRepository
}
```

---

## 8. Servicii (Business Logic)

### 8.1 EventService

**Fisier:** `service/EventService.java`

```java
@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllNative();
    }

    public void createEvent(Event event) {
        // Cerinta A.1: Validarea campurilor introduse
        if (event.getStartTime() == null || event.getEndTime() == null) {
            throw new IllegalStateException("Start and end times are required.");
        }
        if (event.getStartTime().isAfter(event.getEndTime())) {
            throw new IllegalStateException("Start time must be before end time.");
        }
        
        eventRepository.insertEventNative(
            event.getHost().getId(),
            event.getLocation().getId(),
            event.getSport().getId(),
            event.getStartTime(),
            event.getEndTime(),
            "PLANNED"
        );
    }

    public void updateEventStatus(Long id, String status) {
        // Cerinta A.2: Logica pentru statusuri
        // (in desfasurare, suspendata, finalizata)
        eventRepository.updateStatusNative(id, status);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteNative(id);
    }
}
```

### Validari Implementate

| Cerinta | Descriere | Implementare |
|---------|-----------|--------------|
| A.1 | Validarea campurilor | Verificare start/end time not null, startTime < endTime |
| A.2 | Colectie activitati cu statusuri | Status: PLANNED, CONFIRMED, IN_PROGRESS, COMPLETED |

---

## 9. Controllere REST API

### 9.1 UserController

**Fisier:** `controller/UserController.java`  
**Base Path:** `/api/users`

| Metoda | Endpoint | Descriere | Request Body |
|--------|----------|-----------|--------------|
| GET | `/api/users` | Toti utilizatorii | - |
| GET | `/api/users/{id}` | Utilizator dupa ID | - |
| POST | `/api/users/register` | Inregistrare noua | `{ fullName, email, password }` |
| POST | `/api/users/login` | Autentificare | `{ email, password }` |

**Detalii Implementare:**
```java
@PostMapping("/register")
public ResponseEntity<?> registerUser(@RequestBody Users user) {
    // Verifica daca email-ul exista deja
    // Cripteaza parola cu BCrypt
    // Seteaza rolul implicit "User"
    // Salveaza utilizatorul
}

@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
    // Cauta utilizatorul dupa email
    // Verifica parola cu BCrypt
    // Returneaza datele utilizatorului (fara parola)
}
```

---

### 9.2 EventController

**Fisier:** `controller/EventController.java`  
**Base Path:** `/api/events`

| Metoda | Endpoint | Descriere | Request Body |
|--------|----------|-----------|--------------|
| GET | `/api/events` | Toate evenimentele | - |
| GET | `/api/events/{id}` | Eveniment dupa ID | - |
| GET | `/api/events/user/{userId}` | Evenimente ale unui utilizator | - |
| POST | `/api/events` | Creare eveniment | `Event object` |
| POST | `/api/events/{id}/invite` | Invita participant | `{ email }` |
| PUT | `/api/events/{id}/status` | Actualizare status | `{ status }` |
| DELETE | `/api/events/{id}` | Stergere eveniment | - |

---

### 9.3 BookingController

**Fisier:** `controller/BookingController.java`  
**Base Path:** `/api/bookings`

| Metoda | Endpoint | Descriere | Request Body |
|--------|----------|-----------|--------------|
| GET | `/api/bookings/occupied-slots` | Intervale ocupate | Query: `locationId` |
| POST | `/api/bookings` | Creare rezervare | `BookingRequest` |

**Logica de Verificare Suprapuneri:**
```java
@PostMapping
public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
    // 1. Verifica suprapunere pe locatie
    boolean hasOverlap = eventRepository.existsOverlappingEvent(
        locationId, startTime, endTime
    );
    
    // 2. Daca exista arbitru, verifica si disponibilitatea lui
    if (refereeId != null) {
        boolean refereeHasOverlap = eventRepository.existsOverlappingEventForReferee(
            refereeId, startTime, endTime
        );
    }
    
    // 3. Creeaza evenimentul si rezervarea
}
```

---

### 9.4 LocationController

**Fisier:** `controller/LocationController.java`  
**Base Path:** `/api/locations`

| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/locations` | Toate locatiile (cu sporturi) |
| GET | `/api/locations/{id}` | Locatie dupa ID |

---

### 9.5 RefereeController

**Fisier:** `controller/RefereeController.java`  
**Base Path:** `/api/referees`

| Metoda | Endpoint | Descriere | Query Params |
|--------|----------|-----------|--------------|
| GET | `/api/referees` | Toti arbitrii | - |
| GET | `/api/referees/available` | Arbitri disponibili | `startTime`, `endTime` |

**Logica Filtrare Arbitri Disponibili:**
```java
@GetMapping("/available")
public ResponseEntity<List<RefereeDTO>> getAvailableReferees(
        @RequestParam String startTime,
        @RequestParam String endTime) {
    
    LocalDateTime start = LocalDateTime.parse(startTime);
    LocalDateTime end = LocalDateTime.parse(endTime);
    
    // Gaseste arbitrii ocupati in intervalul dat
    List<Long> busyRefereeIds = eventRepository.findBusyRefereeIds(start, end);
    
    // Filtreaza arbitrii disponibili
    List<Referee> availableReferees = allReferees.stream()
        .filter(ref -> !busyRefereeIds.contains(ref.getId()))
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(convertToDTO(availableReferees));
}
```

---

### 9.6 AdminController

**Fisier:** `controller/AdminController.java`  
**Base Path:** `/api/admin`

#### User Management
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/admin/users` | Toti utilizatorii |
| DELETE | `/api/admin/users/{id}` | Sterge utilizator |
| PUT | `/api/admin/users/{id}/role` | Schimba rolul |

#### Referee Management
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/admin/referees` | Toti arbitrii |
| POST | `/api/admin/referees` | Transforma user in arbitru |
| DELETE | `/api/admin/referees/{id}` | Revoca statutul de arbitru |

#### Event Management
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/admin/events` | Toate evenimentele |
| DELETE | `/api/admin/events/{id}` | Sterge eveniment |
| POST | `/api/admin/events/{id}/participants` | Adauga participant |
| DELETE | `/api/admin/events/{eventId}/participants/{userId}` | Elimina participant |
| PUT | `/api/admin/events/{id}/status` | Actualizeaza status |

#### Location (Field) Management
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/admin/locations` | Toate locatiile |
| POST | `/api/admin/locations` | Creeaza locatie noua |
| PUT | `/api/admin/locations/{id}` | Actualizeaza locatie |
| DELETE | `/api/admin/locations/{id}` | Sterge locatie |

#### Sports Management
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/api/admin/sports` | Toate sporturile |

---

## 10. Configurare Securitate

**Fisier:** `config/SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Componente Securitate

| Component | Descriere |
|-----------|-----------|
| `BCryptPasswordEncoder` | Criptare parole (salt automat, factor cost 10) |
| `CORS` | Permite cereri de la `http://localhost:3000` |
| `CSRF` | Dezactivat (API REST stateless) |
| `Authorization` | Toate endpoint-urile `/api/**` sunt publice |

---

## 11. Comunicare cu Frontend-ul

### Arhitectura Comunicarii

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │ ◄──────────────────────────►│                 │
│   REACT APP     │      JSON Requests          │   SPRING BOOT   │
│  (localhost:    │      JSON Responses         │   (localhost:   │
│     3000)       │                             │     8080)       │
│                 │                             │                 │
└─────────────────┘                             └────────┬────────┘
                                                         │
                                                         │ JPA/JDBC
                                                         ▼
                                                ┌─────────────────┐
                                                │   PostgreSQL    │
                                                │  (localhost:    │
                                                │     5432)       │
                                                └─────────────────┘
```

### Format Comunicare

| Aspect | Detalii |
|--------|---------|
| Protocol | HTTP |
| Format Date | JSON |
| Metode HTTP | GET, POST, PUT, DELETE |
| Headers | Content-Type: application/json |
| CORS Origin | http://localhost:3000 |

### Exemple Request/Response

**Login:**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "parola123"
}
```

**Response Success:**
```json
{
  "id": 1,
  "fullName": "Ion Popescu",
  "email": "user@example.com",
  "role": "User"
}
```

---

## 12. Rulare si Build

### Cerinte Sistem
- Java 17 sau superior
- PostgreSQL 12 sau superior
- Maven 3.8 sau superior

### Pasi de Instalare

1. **Cloneaza repository-ul**
```bash
git clone [repository-url]
cd BallTogether/backend
```

2. **Configureaza baza de date PostgreSQL**
```sql
CREATE DATABASE balltogether;
```

3. **Actualizeaza application.properties** (daca e necesar)
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. **Ruleaza aplicatia**
```bash
# Cu Maven Wrapper
./mvnw spring-boot:run

# Sau pe Windows
mvnw.cmd spring-boot:run
```

5. **Verifica ca serverul ruleaza**
```
http://localhost:8080/api/users
```

### Build pentru Productie

```bash
# Creeaza JAR-ul
./mvnw clean package

# Ruleaza JAR-ul
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Structura Build-ului

```
target/
├── backend-0.0.1-SNAPSHOT.jar          # JAR executabil
├── backend-0.0.1-SNAPSHOT.jar.original # JAR fara dependente
├── classes/                             # Clase compilate
├── test-classes/                        # Teste compilate
└── surefire-reports/                    # Rapoarte teste
```

---

## Anexa: Sumar Endpoint-uri API

| Controller | Base Path | Descriere |
|------------|-----------|-----------|
| UserController | `/api/users` | Autentificare si gestionare utilizatori |
| EventController | `/api/events` | CRUD evenimente |
| BookingController | `/api/bookings` | Rezervari si verificare disponibilitate |
| LocationController | `/api/locations` | Terenuri sportive |
| RefereeController | `/api/referees` | Arbitri si disponibilitate |
| AdminController | `/api/admin` | Operatiuni administrative complete |

### Total: 26 Endpoint-uri REST API

---

**Document generat:** Decembrie 2025  
**Versiune:** 1.0  
**Autor:** Documentatie automata generata
