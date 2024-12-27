// Assuming controller functions are in uomController.js
const {
  updateUOM,
  deleteUOM,
  fetchAllUOMs,
  fetchUOMById,
  createUOM,
} = require('../../../controllers/uom.controller')
const uom = require('../../../models/uom.model')
const helper = require('../../../utils/helper')
const moduleNames = require('../../../config/modulenames')
const decodeToken = require('../../../utils/extracttoken')

// Mock dependencies
jest.mock('../../../models/uom.model')
jest.mock('../../../utils/extracttoken')
jest.mock('../../../utils/helper')
jest.mock('../../../config/modulenames')

// Mocking responses
const mockDecodedToken = {
  tenantId: 'tenant123',
  username: 'testUser',
}

describe('UOM Controller Tests', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, params: { id: '1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    }

    // Mock the decodeToken function
    decodeToken.decodeToken.mockReturnValue(mockDecodedToken)

    // Mock helper functions
    helper.isEmpty = jest.fn().mockReturnValue(false)

    // Reset mocks before each test
    jest.clearAllMocks()
  })

  // describe('updateUOM', () => {
  //   it('should return 400 if the request body is empty', async () => {
  //     req.body = {} // Empty body

  //     await updateUOM(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.send).toHaveBeenCalledWith({
  //       message: 'Content can not be empty!',
  //     })
  //   })

  //   it('should return 404 if UOM not found', async () => {
  //     req.body = { UnitName: 'kg', IsPrimary: true, Active: true }

  //     uom.findById.mockResolvedValue('404') // Mock UOM not found

  //     await updateUOM(req, res)

  //     expect(res.status).toHaveBeenCalledWith(404)
  //     expect(res.send).toHaveBeenCalledWith({
  //       message: 'UOM not found.',
  //     })
  //   })

  //   it('should update the UOM successfully', async () => {
  //     req.body = { UnitName: 'kg', IsPrimary: true, Active: true }
  //     const mockUOM = [
  //       { Id: 1, UnitName: 'lb', IsPrimary: false, Active: true },
  //     ]

  //     uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
  //     uom.update.mockResolvedValue(true) // Mock successful update

  //     await updateUOM(req, res)

  //     expect(uom.update).toHaveBeenCalledWith(
  //       {
  //         Id: 1,
  //         UnitName: 'kg',
  //         IsPrimary: true,
  //         Active: true,
  //         TenantId: 'tenant123',
  //         UpdatedOn: expect.any(Date),
  //         UpdatedBy: 'testUser',
  //       },
  //       'testUser'
  //     )
  //     expect(res.status).toHaveBeenCalledWith(200)
  //   })

  //   it('should return 500 if there is an error during update', async () => {
  //     req.body = { UnitName: 'kg' }
  //     const mockUOM = [
  //       { Id: 1, UnitName: 'lb', IsPrimary: false, Active: true },
  //     ]

  //     uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
  //     uom.update.mockRejectedValue(new Error('Update failed')) // Mock error

  //     await updateUOM(req, res)

  //     expect(res.status).toHaveBeenCalledWith(500)
  //   })
  // })

  // describe('deleteUOM', () => {
  //   it('should return 404 if UOM not found', async () => {
  //     uom.findById.mockResolvedValue('404') // Mock UOM not found

  //     await deleteUOM(req, res)

  //     expect(res.status).toHaveBeenCalledWith(404)
  //     expect(res.send).toHaveBeenCalledWith({
  //       message: 'UOM not found.',
  //     })
  //   })

  //   it('should delete the UOM successfully', async () => {
  //     const mockUOM = [{ Id: 1, UnitName: 'kg' }]

  //     uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
  //     uom.deleteUOM.mockResolvedValue(true) // Mock successful delete

  //     await deleteUOM(req, res)

  //     expect(uom.deleteUOM).toHaveBeenCalledWith('1', 'tenant123', 'testUser')
  //     expect(res.status).toHaveBeenCalledWith(204)
  //   })

  //   it('should return 500 if there is an error during deletion', async () => {
  //     const mockUOM = [{ Id: 1, UnitName: 'kg' }]

  //     uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
  //     uom.deleteUOM.mockRejectedValue(new Error('Delete failed')) // Mock error

  //     await deleteUOM(req, res)

  //     expect(res.sendStatus).toHaveBeenCalledWith(500)
  //   })
  // })

  describe('fetchAllUOMs', () => {
    it('should return all UOMs successfully', async () => {
      const mockUOMs = [{ Id: 1, UnitName: 'kg' }]

      uom.getAll.mockResolvedValue(mockUOMs) // Mock fetching all UOMs

      await fetchAllUOMs(req, res)

      expect(res.send).toHaveBeenCalledWith(mockUOMs)
    })

    it('should handle errors when fetching UOMs', async () => {
      const error = new Error('Database error')

      uom.getAll.mockRejectedValue(error)

      await fetchAllUOMs(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        message: 'An error occurred while fetching all UOMs.',
      })
    })
  })

  describe('fetchUOMById', () => {
    it('should return 404 if UOM not found', async () => {
      uom.findById.mockResolvedValue(404)

      await fetchUOMById(req, res)

      expect(decodeToken.decodeToken).toHaveBeenCalledWith(req)
      expect(uom.findById).toHaveBeenCalledWith(
        req.params.id,
        mockDecodedToken.tenantId,
        mockDecodedToken.username,
        expect.any(String)
      )
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({
        message: 'UOM not found.',
      })
    })

    it('should return UOM by ID successfully', async () => {
      const mockUOM = { Id: 1, UnitName: 'kg' }

      uom.findById.mockResolvedValue(mockUOM) // Mock UOM found

      await fetchUOMById(req, res)

      expect(res.send).toHaveBeenCalledWith(mockUOM)
    })

    it('should return 500 if there is an error fetching UOM', async () => {
      const error = new Error('Database error')
      uom.findById.mockRejectedValue(error)

      await fetchUOMById(req, res)

      expect(decodeToken.decodeToken).toHaveBeenCalledWith(req)
      expect(uom.findById).toHaveBeenCalledWith(
        req.params.id,
        mockDecodedToken.tenantId,
        mockDecodedToken.username,
        expect.any(String)
      )
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        message: 'An error occurred while fetching the UOM.',
      })
    })
  })

  // describe('createUOM', () => {
  //   it('should return 400 if the request body is empty', async () => {
  //     req.body = {} // Empty body

  //     await createUOM(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.send).toHaveBeenCalledWith({
  //       message: 'Content can not be empty!',
  //     })
  //   })

  //   it('should create UOM successfully', async () => {
  //     req.body = { UnitName: 'kg', IsPrimary: true, Active: true }

  //     uom.create.mockResolvedValue({ id: 1, UnitName: 'kg' }) // Mock successful creation

  //     await createUOM(req, res)

  //     expect(uom.create).toHaveBeenCalledWith(
  //       {
  //         UnitName: 'kg',
  //         IsPrimary: true,
  //         Active: true,
  //         TenantId: 'tenant123',
  //         CreatedOn: expect.any(Date),
  //         CreatedBy: 'testUser',
  //       },
  //       'testUser'
  //     )
  //     expect(res.send).toHaveBeenCalledWith({ id: 1, UnitName: 'kg' })
  //   })

  //   it('should return 409 if there is a duplicate entry error', async () => {
  //     req.body = { UnitName: 'kg', IsPrimary: true, Active: true }

  //     uom.create.mockRejectedValue('ER_DUP_ENTRY') // Mock duplicate error

  //     await createUOM(req, res)

  //     expect(res.sendStatus).toHaveBeenCalledWith(409)
  //   })

  //   it('should return 500 if there is an error during creation', async () => {
  //     req.body = { UnitName: 'kg' }

  //     uom.create.mockRejectedValue(new Error('Create failed')) // Mock error

  //     await createUOM(req, res)

  //     expect(res.sendStatus).toHaveBeenCalledWith(500)
  //   })
  // })
})
