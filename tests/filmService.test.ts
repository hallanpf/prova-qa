import { describe, it, expect, beforeEach } from 'vitest'
import { FilmService, BusinessError } from '../src/services/filmService'

describe('FilmService', () => {
  let svc: FilmService

  beforeEach(() => {
    svc = new FilmService()
  })

  it('creates, lists and gets a film', () => {
    const f = svc.create({ title: 'Toy Story', year: 1995, rating: 'G' })
    expect(f.id).toBeDefined()
    const list = svc.list()
    expect(list.length).toBe(1)
    const got = svc.getById(f.id)
    expect(got).toEqual(f)
  })

  it('prevents duplicate title+year', () => {
    svc.create({ title: 'The Matrix', year: 1999 })
    expect(() => svc.create({ title: 'The Matrix', year: 1999 })).toThrow(BusinessError)
  })

  it('validates title presence', () => {
    // @ts-ignore
    expect(() => svc.create({ title: '', year: 2000 })).toThrow(BusinessError)
  })

  it('validates year range', () => {
    expect(() => svc.create({ title: 'Old', year: 1700 })).toThrow(BusinessError)
    const nextYear = new Date().getFullYear() + 5
    expect(() => svc.create({ title: 'Future', year: nextYear })).toThrow(BusinessError)
  })

  it('updates a film and enforces uniqueness on update', () => {
    const a = svc.create({ title: 'A', year: 2000 })
    const b = svc.create({ title: 'B', year: 2001 })
    const updated = svc.update(a.id, { title: 'A Updated' })
    expect(updated.title).toBe('A Updated')

    expect(() => svc.update(b.id, { title: 'A Updated', year: 2000 })).toThrow(BusinessError)
  })

  it('removes a film', () => {
    const f = svc.create({ title: 'DeleteMe', year: 2010 })
    svc.remove(f.id)
    expect(svc.list().length).toBe(0)
    expect(() => svc.remove(f.id)).toThrow(BusinessError)
  })

  it('validates rating values', () => {
    // @ts-ignore allow bad rating
    expect(() => svc.create({ title: 'BadRating', year: 2005, rating: 'XXX' })).toThrow(BusinessError)
  })
})
