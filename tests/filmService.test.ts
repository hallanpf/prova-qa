import { describe, it, expect, beforeEach } from 'vitest'
import { FilmService, BusinessError } from '../src/services/filmService'

describe('FilmService', () => {
  let svc: FilmService

  beforeEach(() => {
    svc = new FilmService()
  })

  describe('criar', () => {
    it('criar_quandoValido_retornaFilmeComId', () => {
      const f = svc.create({ title: 'Toy Story', year: 1995, rating: 'G' })
      expect(f.id).toBeDefined()
      expect(f.title).toBe('Toy Story')
    })

    it('criar_quandoDuplicado_lancaBusinessError', () => {
      svc.create({ title: 'The Matrix', year: 1999 })
      expect(() => svc.create({ title: 'The Matrix', year: 1999 })).toThrow(BusinessError)
    })

    it('criar_quandoTituloVazio_lancaBusinessError', () => {
      expect(() => svc.create({ title: '   ', year: 2000 } as any)).toThrow(BusinessError)
    })

    it('criar_quandoAnoInvalido_lancaBusinessError', () => {
      expect(() => svc.create({ title: 'Old', year: 1700 })).toThrow(BusinessError)
      const nextYear = new Date().getFullYear() + 5
      expect(() => svc.create({ title: 'Future', year: nextYear })).toThrow(BusinessError)
    })

    it('criar_quandoRatingInvalido_lancaBusinessError', () => {
      expect(() => svc.create({ title: 'BadRating', year: 2005, rating: 'XXX' as any })).toThrow(BusinessError)
    })
  })

  describe('listar e obterPorId', () => {
    it('listar_quandoVazio_retornaArrayVazio', () => {
      expect(svc.list()).toEqual([])
    })

    it('obterPorId_quandoExiste_retornaFilme', () => {
      const f = svc.create({ title: 'Toy Story', year: 1995 })
      const got = svc.getById(f.id)
      expect(got).toEqual(f)
    })

    it('listar_retornaCopiaNaoReferencia', () => {
      const f = svc.create({ title: 'Immutable', year: 2000 })
      const list = svc.list()
      list.push({ id: 'x', title: 'mut', year: 2001 } as any)
      // lista interna do serviço não deve ser afetada
      expect(svc.list().length).toBe(1)
    })
  })

  describe('atualizar', () => {
    it('atualizar_quandoValido_aplicaAlteracoes', () => {
      const a = svc.create({ title: 'A', year: 2000 })
      const updated = svc.update(a.id, { title: 'A Updated' })
      expect(updated.title).toBe('A Updated')
    })

    it('atualizar_quandoConflito_lancaBusinessError', () => {
      const a = svc.create({ title: 'A', year: 2000 })
      const b = svc.create({ title: 'B', year: 2001 })
      expect(() => svc.update(b.id, { title: 'A', year: 2000 })).toThrow(BusinessError)
    })

    it('atualizar_quandoNaoEncontrado_lancaBusinessError', () => {
      expect(() => svc.update('no-id', { title: 'X' })).toThrow(BusinessError)
    })
  })

  describe('remover', () => {
    it('remover_quandoExiste_removeFilme', () => {
      const f = svc.create({ title: 'DeleteMe', year: 2010 })
      svc.remove(f.id)
      expect(svc.list().length).toBe(0)
    })

    it('remover_quandoNaoEncontrado_lancaBusinessError', () => {
      expect(() => svc.remove('no-id')).toThrow(BusinessError)
    })
  })
})
