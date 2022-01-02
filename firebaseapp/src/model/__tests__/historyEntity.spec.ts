/* eslint-disable import/first */
// Mock Imports
import { objDiff } from '../utils'

describe('tools-suite', () => {
  it('simple difference', () => {
    const diff = objDiff({ a: 1 }, { a: 2 })
    expect(diff).toStrictEqual({ a: 1 })
  })

  test('simpleObject', () => {
    expect(objDiff({ a: 1 }, { a: 1 })).toStrictEqual({})
    expect(objDiff({ a: 1 }, { a: 2 })).toStrictEqual({ a: 1 })
    expect(objDiff({ a: 1, b: 2 }, { a: 1 })).toStrictEqual({ b: 2 })
    expect(objDiff({ b: 2, a: 1 }, { a: 1 })).toStrictEqual({ b: 2 })
    expect(objDiff({ a: 1 }, { a: 1, b: 2 })).toStrictEqual({ b: 2 })
    expect(objDiff({ a: 1, b: 2 }, { b: 2, a: 1 })).toStrictEqual({})
  })

  test('simpleDeepObject', () => {
    expect(objDiff({ a: { a: 1, b: 2 } }, { a: { a: 1, b: 3 } })).toStrictEqual({
      a: { b: 2 },
    })
    expect(
      objDiff({ a: { a: 2, b: 2, c: 3 } }, { a: { a: 1, b: 3, c: 3 } }),
    ).toStrictEqual({
      a: { a: 2, b: 2 },
    })
    expect(
      objDiff(
        //
        { a: { a: 2, b: 2, c: 3 }, c: 4 },
        //
        { a: { a: 1, b: 3, c: 3, d: 4 }, b: 1 },
      ),
    ).toStrictEqual({
      a: { a: 2, b: 2, d: 4 },
      b: 1,
      c: 4,
    })
  })

  it('Simple Array', () => {
    // neues Element am Ende hinzufügen -> das hinzugefügte muss angezeigt werden
    expect(objDiff([1, 2], [1, 2, 4])).toStrictEqual([4])

    // neues Element einfügen -> das eingefügte muss angezeigt werden
    expect(objDiff([1, 3], [1, 2, 3])).toStrictEqual([2])

    // im neuen Array sind 2 Element mehr, die müssen angezeigt werden.
    expect(objDiff([1, 2], [1, 3, 2, 4])).toStrictEqual([3, 4])

    // Element von Array am Ende gelöscht -> zeige das gelöschte an
    expect(objDiff([1, 2, 3], [1, 2])).toStrictEqual([3])

    // Element von Array in der Mitte gelöscht -> zeige das gelöschte an
    expect(objDiff([1, 2, 3], [1, 3])).toStrictEqual([2])

    // array vollständig anders -> sollte durch Tiefenverlgeich keine Änderung ergeben
    expect(objDiff([1, 2], [2, 1])).toStrictEqual([])

    // Element gelöscht und eins hinzugefügt -> gelöschtes und hinzugefügtes Element muss angezeigt werden
    expect(objDiff([1, 3, 2], [1, 2, 4])).toStrictEqual([4, 3])

    // array teil falsch -> das fehlende Element und das neue muss angezeigt werden
    expect(objDiff([1, 3, 2], [1, 4, 2])).toStrictEqual([4, 3])
  })

  test('Array of Objects', () => {
    // gleiche Elemente
    expect(objDiff([{ a: 1 }], [{ a: 1 }])).toStrictEqual([])
    // element hinzugefügt
    expect(objDiff([{ a: 1 }], [{ a: 1 }, { b: 2 }])).toStrictEqual([{ b: 2 }])
    // element gelöscht
    expect(objDiff([{ a: 1 }, { b: 2 }], [{ a: 1 }])).toStrictEqual([{ b: 2 }])
    // element hinzugefügt + gelöscht
    expect(objDiff([{ a: 1, b: 1 }], [{ a: 2 }])).toStrictEqual([
      { a: 2 },
      { a: 1, b: 1 },
    ])
  })

  test('Object with Array', () => {
    expect(
      objDiff(
        {
          a: 1,
          b: [1, 2, 3, 4],
          d: 2,
        },
        {
          a: 1,
          b: [1, 2, 3, 5],
          c: 1,
        },
      ),
    ).toStrictEqual({ b: [5, 4], d: 2, c: 1 })
  })

  it('array difference', () => {
    const old = {
      //
      a: [2, { b: 1, a: 2 }],
      b: 1,
      c: { a: 1, b: 1 },
      d: { a: 1, b: { a: 1, b: 2 } },
      e: [3],
    }
    const newValue = {
      //
      a: [2, { b: 1, a: 2, c: 3 }],
      b: 2,
      c: { a: 1, b: 1 },
      d: { a: 1, b: { a: 2, b: 2 } },
      e: [1, 3],
    }

    const diffExpect = {
      //
      b: 1,
      a: [
        { a: 2, b: 1, c: 3 },
        { a: 2, b: 1 },
      ],
      d: { b: { a: 1 } },
      e: [1],
    }

    const diff = objDiff(old, newValue)
    expect(diff).toStrictEqual(diffExpect)
  })
})
