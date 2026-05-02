# Rick and Morty · Episodios (Angular)

Aplicación de prueba técnica que consume la [API pública de Rick and Morty](https://rickandmortyapi.com/documentation/#rest) y muestra episodios con filtros, paginación, ordenación y detalle en modal.

---

## Cómo funciona la aplicación

### Flujo para el usuario

1. Al entrar en `http://localhost:4200/`, el enrutador redirige a **`/episodes`**.
2. La feature **episodios** se carga en **lazy** (`loadChildren`): solo entonces se descarga el chunk del listado.
3. La página despacha **`loadEpisodes`** (página 1). Mientras el estado está en **carga**, se muestra un spinner.
4. El usuario puede **buscar por nombre** (el texto se envía al store con debounce; el efecto vuelve a pedir la página 1), **filtrar por temporada** (prefijo `S01`… sobre la página actual de la API), **cambiar de página** en la tabla y **ordenar** por código, nombre o fecha (ordenación en **cliente** sobre los episodios de la página cargada).
5. Al hacer clic en una fila de la tabla o en la acción **Ver detalle** se abre un **modal** con datos del episodio y una muestra de **personajes** (petición adicional a la API según los IDs del episodio).
6. Si la API falla, se muestra mensaje de error y **reintentar**. Si no hay resultados, estado **vacío** con mensaje orientativo.

### Flujo de datos (resumen)

```
UI (EpisodesPageComponent)
  → dispatch acciones NgRx (loadEpisodes, changeSearch, changePage, …)
  → reducer actualiza estado (loading, error, filtros, caché)
  → effects llaman a EpisodesApiService (HttpClient)
  → éxito → loadEpisodesSuccess (y caché LRU por clave página + nombre + temporada)
  → selectores derivan la vista (episodios ordenados, flags de vacío, paginación)
  → la UI se actualiza (toSignal / OnPush)
```

El **interceptor** HTTP registra errores de forma centralizada; los efectos traducen fallos a mensajes que ve el usuario.

---

## Requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+

---

## Instalación y comandos

| Comando                | Descripción                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `npm install`          | Instala dependencias.                                                                               |
| `npm start`            | Servidor de desarrollo (`ng serve`) en `http://localhost:4200/`.                                    |
| `npm run build`        | Build de producción → `dist/rick-morty-app/`.                                                       |
| `npm test`             | Tests unitarios (Karma + Jasmine).                                                                  |
| `npm run lint`         | ESLint (`angular-eslint`, flat config).                                                             |
| `npm run type-check`   | `ngc --noEmit` sobre `tsconfig.app.json` (TypeScript + plantillas estrictas).                       |
| `npm run format:write` | Aplica Prettier en `src/` (útil en local antes de commit).                                          |
| `npm run format:check` | Comprueba formato sin modificar archivos (útil en CI o para verificar que ya está todo formateado). |

**Tests en CI (sin ventana):**

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

**Git hooks (Husky):** `pre-commit` ejecuta `lint-staged` (Prettier en archivos staged). `commit-msg` valida formato de mensaje. `pre-push` ejecuta `npm run build`. Tras clonar, `npm install` registra los hooks si existe `.git`.

---

## Funcionalidades cubiertas (checklist vs enunciado)

- Listado de episodios con información relevante (código, nombre, fecha de emisión).
- Estados **carga**, **error** (con reintento) y **sin resultados**.
- Detalle en **modal** con enriquecimiento (personajes de muestra).
- Más de un filtro/interacción: búsqueda por nombre, temporada, paginación y ordenación.
- Separación **components / services / models**, NgRx, `HttpClient`, manejo de errores, UI clara (Tailwind), tipado fuerte, tests unitarios y README con decisiones.

---

## Decisiones técnicas (resumen)

| Área      | Decisión                                                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | Angular 19, **standalone**, rutas con **`loadChildren`** (lazy) para episodios.                                                                                                                      |
| Estado    | **NgRx** (store, efectos, selectores). Orden de columnas en selectores puros.                                                                                                                        |
| Caché     | **`pageCache`** en el store por `(página, nombre, temporada)`; el effect no llama a la API si hay hit. **LRU** con tope `EPISODES_PAGE_CACHE_MAX_ENTRIES`; se vacía al cambiar búsqueda o temporada. |
| HTTP      | **Interceptor** funcional + utilidades de mensaje de error.                                                                                                                                          |
| UI        | **Tailwind v3**, tipografía Inter, componentes reutilizables (`DataTable`, `BaseModal`, formularios).                                                                                                |
| Calidad   | **ESLint** + **Prettier** + **Husky** + `type-check`.                                                                                                                                                |

Estructura de carpetas relevante:

```
src/app/
  components/     # base-modal, datatable, form, loading-spinner
  core/           # constants, interceptors, services, animations, theme
  features/episodes/
    models/, services/, state/, components/, episodes.routes.ts
```

---

## Por qué algunas cosas y por qué no otras

### Gestor de paquetes: **npm** (no pnpm en este repo)

- **Por qué npm:** es el flujo por defecto del **Angular CLI** en este proyecto (`package-lock.json`), menos fricción para quien clona el desafío y coincide con la documentación oficial más habitual.
- **Por qué no pnpm aquí:** en equipos reales **sí** tiene sentido pnpm por resolución estricta y disco; para una **prueba técnica acotada** el beneficio marginal no compensa migrar lockfile, CI y hooks.

### Estado del servidor: **NgRx + caché manual**

- **Por qué NgRx:** el enunciado lo **recomienda** explícitamente; centraliza lista, filtros, paginación y errores de forma trazable y testeable.
- **Por qué no TanStack Query:** duplicaría responsabilidades con el store en un solo listado; La caché de páginas resuelve el bonus sin dependencia extra.

### UI: **Tailwind**

- **Por qué Tailwind:** control fino del layout y buena experiencia de uso sin depender de un sistema de componentes de terceros para este alcance.
- **Por qué no Material:** no es obligatorio en el enunciado.

### Animaciones: **`@angular/animations`**

- Transiciones de modal y entrada de la tarjeta del listado; `provideAnimations()` en `app.config.ts`.

### Tests: **Karma + Jasmine**

- Es el stack por defecto del **builder de tests** de Angular en este proyecto; tests sin red (HTTP mockeado, reducer, selectores, utilidades de caché, etc.).

---

## Notas de comportamiento / API

- La API devuelve **20 episodios por página**; la paginación usa `info.count` e `info.pages`.
- El **filtro por temporada** actúa sobre los resultados **de la página actual** devuelta por la API (no agrega todas las páginas en cliente).
- Los **personajes del modal** no comparten el mismo `pageCache` que el listado: son otro recurso y otro ciclo de vida (petición al abrir detalle).
