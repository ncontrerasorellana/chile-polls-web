# Encuestas Presidenciales Chile 🇨🇱

Aplicación web moderna para visualizar y analizar encuestas de intención de voto para las elecciones presidenciales de Chile.

## Características

- 📊 **Visualización interactiva** de datos de encuestas
- 📈 **Gráficos de evolución temporal** con Recharts
- 🎯 **Filtros avanzados** por fecha y candidatos
- 🔄 **Actualizaciones en tiempo real** de datos
- 📱 **Diseño 100% responsivo** (mobile-first)
- ⚡ **Animaciones fluidas** con Framer Motion
- 🎨 **UI moderna** con Tailwind CSS

## Stack Tecnológico

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Date Handling**: date-fns

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── CandidateCard.tsx
│   ├── EvolutionChart.tsx
│   ├── AveragesTable.tsx
│   ├── DateRangeFilter.tsx
│   ├── CandidateFilter.tsx
│   ├── Sparkline.tsx
│   ├── LoadingSkeleton.tsx
│   └── ErrorBoundary.tsx
├── pages/           # Páginas de la aplicación
│   ├── Home.tsx
│   └── Dashboard.tsx
├── hooks/           # Custom React hooks
│   ├── usePollsData.ts
│   ├── useCandidates.ts
│   └── useFilters.ts
├── store/           # Zustand stores
│   └── filterStore.ts
├── services/        # Servicios API
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utilidades
│   ├── dateHelpers.ts
│   └── chartColors.ts
└── styles/          # Estilos globales
    └── index.css
```

## Instalación y Uso

### Requisitos Previos

- Node.js 20+ y npm

### Instalación

```bash
# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build

```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview
```

## Configuración de API

El proyecto está configurado para conectarse a una API backend en `http://localhost:3000`. Puedes cambiar esto en `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Cambia esto a tu backend
        changeOrigin: true,
      },
    },
  },
})
```

## API Endpoints Esperados

La aplicación espera los siguientes endpoints:

- `GET /api/polls` - Obtener encuestas con filtros opcionales
- `GET /api/candidates` - Obtener lista de candidatos
- `GET /api/candidates/:id` - Obtener candidato específico
- `GET /api/polls/averages` - Obtener promedios de encuestas

## Componentes Principales

### Dashboard
Página principal que muestra:
- Filtros de fecha y candidatos
- Tarjetas de candidatos con sparklines
- Gráfico de evolución temporal
- Tabla de promedios

### CandidateCard
Muestra información de un candidato:
- Foto y nombre
- Porcentaje actual
- Tendencia (subiendo/bajando/estable)
- Mini gráfico sparkline

### EvolutionChart
Gráfico de líneas interactivo mostrando la evolución temporal de todos los candidatos.

### Filters
Sistema de filtros para:
- Selección de rango de fechas
- Presets de tiempo (semana, mes, 3 meses, todos)
- Selección de candidatos específicos

## Características Técnicas

### State Management
- **Zustand** para estado global de filtros
- Custom hooks para lógica de datos
- React hooks para estado local

### Optimización
- Memoización con `useMemo` para cálculos pesados
- Lazy loading de componentes
- Código splitting con React Router

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid responsivo que se adapta automáticamente

## Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Crear build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
```

## Licencia

MIT
