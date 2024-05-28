import { validateJson } from '@/plugins/utils'
import fs from 'fs'
import path from 'path'

describe('workspace validation', () => {
  async function validateWrapper(data, schemaName) {
    try {
      await validateJson(data, schemaName)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // Tests for invalid data
  const invalidTests = [
    // {
    //   name: 'no array',
    //   data: { simulations: [], stics: [], toto: [] },
    //   expected: 'Validation Error',
    // },
    // {
    //   name: 'no simulations',
    //   data: {
    //     stics: [],
    //     animalProfiles: [],
    //     classicFeeds: [],
    //   },
    //   expected: 'Validation Error',
    // },
  ]

  invalidTests.forEach((test) => {
    it(test.name, async () => {
      await expect(validateWrapper(test.data, 'workspace')).rejects.toThrow(test.expected)
    })
  })

  // Tests for valid data
  const validTests = [
    {
      name: 'structure is valid',
      data: {
        simulations: [],
        stics: [],
        animalProfiles: [],
        classicFeeds: [],
      },
      expected: true,
    },
  ]

  validTests.forEach((test) => {
    it(test.name, async () => {
      await expect(validateJson(test.data, 'workspace')).resolves.toBe(test.expected)
    })
  })

  // Test with workspace.json file
  const workspaceFile = path.join(__dirname, 'fixtures/workspace.json')
  const workspace = JSON.parse(fs.readFileSync(workspaceFile, 'utf8'))

  it('workspace structure is valid', async () => {
    await expect(validateJson(workspace, 'workspace')).resolves.toBe(true)
  })

  // Test for schema import error
  it('throws error when schema module cannot be imported', async () => {
    const invalidSchemaName = 'nonExistentSchema'
    const data = { simulations: [], stics: [], animalProfiles: [], classicFeeds: [] }
    await expect(validateWrapper(data, invalidSchemaName)).rejects.toThrow('Configuration error')
  })
})
