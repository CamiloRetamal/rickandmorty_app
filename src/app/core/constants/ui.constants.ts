export const EPISODES_UI = {
  title: 'Episodios',
  searchLabel: 'Buscar',
  searchPlaceholder: 'Buscar por nombre',
  seasonLabel: 'Temporada',
  seasonAll: 'Todas',
  loading: 'Cargando episodios…',
  errorTitle: 'No se pudieron cargar los episodios',
  retry: 'Reintentar',
  emptyTitle: 'Sin episodios',
  emptyHint:
    'No hay coincidencias con el nombre y la temporada actuales. Cambia la búsqueda o el filtro de temporada.',
  columns: {
    code: 'Código',
    name: 'Nombre',
    airDate: 'Emisión',
  },
  table: {
    actions: 'Acciones',
    viewEpisode: 'Ver detalle',
  },
  detail: {
    title: 'Detalle del episodio',
    airDate: 'Fecha de emisión',
    code: 'Código',
    created: 'Registro API',
    characters: 'Personajes (muestra)',
    close: 'Cerrar',
    loadingCharacters: 'Cargando personajes…',
    charactersLoadError: 'No se pudieron cargar los personajes.',
  },
} as const

export const EPISODES_SEASON_SELECT_OPTIONS: readonly {
  value: string
  label: string
}[] = [
  { value: '', label: EPISODES_UI.seasonAll },
  { value: 'S01', label: 'Temporada 1' },
  { value: 'S02', label: 'Temporada 2' },
  { value: 'S03', label: 'Temporada 3' },
  { value: 'S04', label: 'Temporada 4' },
  { value: 'S05', label: 'Temporada 5' },
  { value: 'S06', label: 'Temporada 6' },
]
