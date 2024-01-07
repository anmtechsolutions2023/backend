module.exports = {
  taxtypes: {
    fetchAll: 'SELECT * FROM TaxTypes WHERE TenantId = ?',
    fetchById: 'SELECT * FROM TaxTypes WHERE Id = ? and TenantId = ?',
    create:
      'insert into TaxTypes (Id, Name, Value, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?,?)',
    delete: 'DELETE FROM TaxTypes WHERE Id = ?  and TenantId = ?',
    update:
      'UPDATE TaxTypes SET Name = ?, Value = ? , Active = ?,  UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?',
  },
  uom: {
    fetchAll: 'SELECT * FROM UOM WHERE TenantId = ?',
    fetchById: 'SELECT * FROM UOM WHERE Id = ? and TenantId = ?',
    create:
      'insert into UOM (Id, UnitName, IsPrimary, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?,?)',
    delete: 'DELETE FROM UOM WHERE Id = ? and TenantId = ?',
    update:
      'UPDATE UOM SET UnitName = ?, IsPrimary = ? , Active = ?, UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?',
  },
  categorydetail: {
    fetchAll: 'SELECT * FROM categorydetail WHERE TenantId = ?',
    fetchById: 'SELECT * FROM categorydetail WHERE Id = ? and TenantId = ?',
    create:
      'insert into categorydetail (Id, Name, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?)',
    delete: 'DELETE FROM categorydetail WHERE Id = ? and TenantId = ?',
    update:
      'UPDATE categorydetail SET Name = ?, Active = ?, UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?',
  },
  transactiontypeconfig: {
    fetchAll: 'SELECT * FROM transactiontypeconfig WHERE TenantId = ?',
    fetchById:
      'SELECT * FROM transactiontypeconfig WHERE Id = ? and TenantId = ?',
    create:
      'insert into transactiontypeconfig (Id, StartCounterNo, Prefix, Format, Active, TenantId, CreatedOn, CreatedBy) values(?,?,?,?,?,?,?,?)',
    delete: 'DELETE FROM transactiontypeconfig WHERE Id = ? and TenantId = ?',
    update:
      'UPDATE transactiontypeconfig SET StartCounterNo = ?, Prefix = ?, Format = ?, Active = ?, UpdatedOn = ?, UpdatedBy = ? WHERE Id = ? and TenantId = ?',
  },
}
