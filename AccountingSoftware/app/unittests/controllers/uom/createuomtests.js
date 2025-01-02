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
const i18n = require('../../../utils/i18n')
const handleDatabaseError = require('../../../common/errorhandle.common')
const statusCodes = require('../../../config/statusCodes')

// Mock dependencies
jest.mock('../../../models/uom.model')
jest.mock('../../../utils/extracttoken')
jest.mock('../../../utils/helper')
jest.mock('../../../config/modulenames')
jest.mock('../../../utils/i18n')

// Mocking responses
const mockDecodedToken = {
  tenantId: 'tenant123',
  username: 'testUser',
}

describe('UOM Controller Tests', () => {
  let req, res

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token',
        'accept-language': 'en',
      },
      ...mockDecodedToken,
      body: {},
      params: { id: '1' },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }

    // Mock the decodeToken function
    decodeToken.decodeToken.mockReturnValue(mockDecodedToken)

    i18n.setLocale.mockImplementation(() => {})
    i18n.__.mockImplementation((key) => key)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('updateUOM', () => {
    it('should return 400 if the request body is empty', async () => {
      req.body = {} // Empty body

      await updateUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_BAD_REQUEST
      )
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    })

    it('should return 404 if UOM not found', async () => {
      req.body = { UnitName: 'kg', IsPrimary: true, Active: true }

      uom.findById.mockResolvedValue(statusCodes.HTTP_STATUS_NOT_FOUND) // Mock UOM not found

      await updateUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(statusCodes.HTTP_STATUS_NOT_FOUND)
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    })

    it('should update the UOM successfully', async () => {
      req.body = { UnitName: 'kg', IsPrimary: true, Active: true }
      const mockUOM = [
        { Id: 1, UnitName: 'lb', IsPrimary: false, Active: true },
      ]

      uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
      uom.update.mockResolvedValue(true) // Mock successful update

      await updateUOM(req, res)

      expect(uom.update).toHaveBeenCalledWith(
        {
          Id: 1,
          UnitName: 'kg',
          IsPrimary: true,
          Active: true,
          TenantId: 'tenant123',
          UpdatedOn: expect.any(Date),
          UpdatedBy: 'testUser',
        },
        'testUser'
      )
      expect(res.status).toHaveBeenCalledWith(true)
    })

    it('should return 500 if there is an error during update', async () => {
      req.body = { UnitName: 'kg' }
      const mockUOM = [
        { Id: 1, UnitName: 'lb', IsPrimary: false, Active: true },
      ]

      uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
      uom.update.mockRejectedValue(new Error('Update failed')) // Mock error

      await updateUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('deleteUOM', () => {
    it('should return 404 if UOM not found', async () => {
      uom.findById.mockResolvedValue(statusCodes.HTTP_STATUS_NOT_FOUND)

      await deleteUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(statusCodes.HTTP_STATUS_NOT_FOUND)
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    })

    it('should delete the UOM successfully', async () => {
      const mockUOM = [{ Id: 1, UnitName: 'kg' }]

      uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
      uom.deleteById.mockResolvedValue(true) // Mock successful delete

      await deleteUOM(req, res)

      expect(uom.deleteById).toHaveBeenCalledWith('1', 'tenant123', 'testUser')
      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_NO_CONTENT
      )
    })

    it('should return 500 if there is an error during deletion', async () => {
      const mockUOM = [{ Id: 1, UnitName: 'kg' }]

      uom.findById.mockResolvedValue(mockUOM) // Mock UOM found
      uom.deleteById.mockRejectedValue(new Error('Delete failed')) // Mock error

      await deleteUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
    })
  })

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

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.modules.uom.internalServerError'),
      })
    })
  })

  describe('fetchUOMById', () => {
    it('should return 404 if UOM not found', async () => {
      uom.findById.mockResolvedValue(statusCodes.HTTP_STATUS_NOT_FOUND)

      await fetchUOMById(req, res)

      expect(uom.findById).toHaveBeenCalledWith(
        req.params.id,
        mockDecodedToken.tenantId,
        mockDecodedToken.username,
        expect.any(String)
      )
      expect(res.status).toHaveBeenCalledWith(statusCodes.HTTP_STATUS_NOT_FOUND)
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.modules.uom.notFound'),
      })
    })

    it('should return DB not found error when there is not DB', async () => {
      uom.findById.mockResolvedValue(statusCodes.DB_NOT_FOUND)

      await fetchUOMById(req, res)

      expect(uom.findById).toHaveBeenCalledWith(
        req.params.id,
        mockDecodedToken.tenantId,
        mockDecodedToken.username,
        expect.any(String)
      )

      expect(res.send).toHaveBeenCalledWith(statusCodes.DB_NOT_FOUND)
    })

    it('should return UOM by ID successfully', async () => {
      const mockUOM = { Id: 1, UnitName: 'kg' }

      uom.findById.mockResolvedValue(mockUOM)

      await fetchUOMById(req, res)

      expect(res.send).toHaveBeenCalledWith(mockUOM)
    })

    it('should return 500 if there is an error fetching UOM', async () => {
      uom.findById.mockRejectedValue(
        statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
      )

      await fetchUOMById(req, res)

      expect(uom.findById).toHaveBeenCalledWith(
        req.params.id,
        mockDecodedToken.tenantId,
        mockDecodedToken.username,
        expect.any(String)
      )
      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.modules.uom.internalServerError'),
      })
    })
  })

  describe('createUOM', () => {
    it('should return 400 if the request body is empty', async () => {
      req.body = {} // Empty body

      await createUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_BAD_REQUEST
      )
      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    })

    it('should create UOM successfully', async () => {
      req.body = { UnitName: 'kg', IsPrimary: true, Active: true }

      uom.create.mockResolvedValue({ id: 1, UnitName: 'kg' }) // Mock successful creation

      await createUOM(req, res)

      expect(uom.create).toHaveBeenCalledWith(
        {
          UnitName: 'kg',
          IsPrimary: true,
          Active: true,
          TenantId: 'tenant123',
          CreatedOn: expect.any(Date),
          CreatedBy: 'testUser',
        },
        'testUser'
      )
      expect(res.send).toHaveBeenCalledWith({ id: 1, UnitName: 'kg' })
    })

    it('should return 409 if there is a duplicate entry error', async () => {
      req.body = { UnitName: 'kg', IsPrimary: true, Active: true }
      req.tenantId = 'tenant123'
      req.username = 'testUser'

      const err = new handleDatabaseError.DatabaseError(
        'error',
        statusCodes.DB_DUPLICATE_ENTRY
      )

      uom.create.mockRejectedValue(err)

      await createUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(statusCodes.DB_DUPLICATE_ENTRY)
    })

    it('should return 500 if there is an error during creation', async () => {
      req.body = { UnitName: 'kg' }

      uom.create.mockRejectedValue(
        new handleDatabaseError.DatabaseError(
          i18n.__('messages.errors.validation.emptyContent'),
          statusCodes.HTTP_STATUS_BAD_REQUEST
        )
      )

      await createUOM(req, res)

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.HTTP_STATUS_BAD_REQUEST
      )

      expect(res.send).toHaveBeenCalledWith({
        message: i18n.__('messages.errors.validation.emptyContent'),
      })
    })
  })
})
