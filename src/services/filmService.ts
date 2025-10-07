import { Film, Rating } from '../models/film'
import { v4 as uuidv4 } from 'uuid'

export class BusinessError extends Error {}

export class FilmService {
  private films: Film[] = []

  create(film: Omit<Film, 'id'>): Film {
    this.validateFilmInput(film)

    if (this.films.some(f => f.title === film.title && f.year === film.year)) {
      throw new BusinessError('Filme com título idêntico e já existente')
    }

    const created: Film = { ...film, id: uuidv4() }
    this.films.push(created)
    return created
  }

  list(): Film[] {
    return [...this.films]
  }

  getById(id: string): Film | undefined {
    return this.films.find(f => f.id === id)
  }

  update(id: string, patch: Partial<Omit<Film, 'id'>>): Film {
    const existing = this.getById(id)
    if (!existing) throw new BusinessError('Filme não encontrado')

    const updated = { ...existing, ...patch }
    this.validateFilmInput(updated)

    if (
      this.films.some(
        f => f.id !== id && f.title === updated.title && f.year === updated.year,
      )
    ) {
      throw new BusinessError('Filme com mesmo título e ano já existe')
    }

    this.films = this.films.map(f => (f.id === id ? updated : f))
    return updated
  }

  remove(id: string): void {
    const before = this.films.length
    this.films = this.films.filter(f => f.id !== id)
    if (this.films.length === before) throw new BusinessError('Filme não encontrado')
  }

  private validateFilmInput(film: Partial<Film>) {
    if (!film.title || film.title.trim().length === 0) {
      throw new BusinessError('O título deve ser fornecido')
    }

    if (!film.year || typeof film.year !== 'number') {
      throw new BusinessError('O ano deve ser um número')
    }

    const currentYear = new Date().getFullYear()
    if (film.year < 1888 || film.year > currentYear + 1) {
      throw new BusinessError('O ano está fora do intervalo válido')
    }

    if (film.rating) {
      const allowed: Rating[] = ['G', 'PG', 'PG-13', 'R', 'NC-17']
      if (!allowed.includes(film.rating as Rating)) {
        throw new BusinessError('Classificação inválida')
      }
    }
  }
}
