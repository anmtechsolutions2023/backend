-- Table Creation 

-- TaxTypes table
create table TaxTypes
(
    Id varchar(50) not null,
    Name varchar(50) not null,
    Value varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
);

-- UOM table
create table UOM
(
    Id VARCHAR(50) not null,
    UnitName VARCHAR(50) not null,
    IsPrimary tinyint(1),
    Active TINYINT(1),
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (UnitName, TenantId)
);

-- CategoryDetail table

create table categorydetail
(
    Id VARCHAR(50) not null,
    Name varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

-- TransactionTypeConfig table

create table transactiontypeconfig
(
    Id VARCHAR(50) not null,
    StartCounterNo varchar(50) not null,
    Prefix varchar(50) not null,
    Format varchar(100) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (StartCounterNo, Prefix, Format, TenantId)
)

-- Organization Detail table
create table organizationdetail
(
    Id varchar(50) not null,
    Name varchar(100) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

-- UOMFactor table

create table uomfactor
(
    Id varchar(50) not null,
    PrimaryUOMId VARCHAR(50) not null,
    SecondaryUOMId VARCHAR(50) not null,
    Factor VARCHAR(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    FOREIGN KEY (PrimaryUOMId) REFERENCES UOM(Id),
    FOREIGN KEY (SecondaryUOMId) REFERENCES UOM(Id),
    UNIQUE (PrimaryUOMId, SecondaryUOMId, Factor, TenantId)
)

-- TransactionType table

create table transactiontype
(
    Id varchar(50) not null,
    Name varchar(50) not null,
    TransactionTypeConfigId varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId),
    FOREIGN KEY (TransactionTypeConfigId) REFERENCES transactiontypeconfig(Id)
)


-- AccountTypeBase table

create table accounttypebase
(
    Id varchar(50) not null,
    Name varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

-- TransactionTypeStatus table

create table transactiontypestatus
(
    Id varchar(50) not null,
    Name varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

-- ContactAddressType table

create table contactaddresstype
(
    Id varchar(50) not null,
    Name varchar(50) not null,
    Active tinyint(1) not null,
    TenantId varchar(50) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

-- TaxGroup table

create table taxgroup
(
	Id varchar(50) not null,
    Name varchar(50) not null,
    TenantId varchar(50) not null,
    Active tinyint(1) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Name, TenantId)
)

 -- Tax Group Tax Type Mapper table
create table taxgrouptaxtypemapper
(
	Id varchar(50) not null,
    TaxGroupId varchar(50) not null,
    TaxTypeId varchar(50) not null,
    TenantId varchar(50) not null,
    Active tinyint(1) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (TaxGroupId, TaxTypeId, TenantId),
    FOREIGN KEY (TaxGroupId) REFERENCES taxgroup(Id),
    FOREIGN KEY (TaxTypeId) REFERENCES TaxTypes(Id)
)

-- Map Provider table

create table mapprovider
(
    Id varchar(50) not null,
    ProviderName varchar(50) not null,
    TenantId varchar(50) not null,
    Active tinyint(1) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (ProviderName, TenantId)
)

-- Location Detail table

create table locationdetail
(
    Id varchar(50) not null,
    Lat varchar(50) not null,
    Lng varchar(50) not null,
    CF1 varchar(50),
    CF2 varchar(50),
    CF3 varchar(50),
    CF4 varchar(50),
    TenantId varchar(50) not null,
    Active tinyint(1) not null,
    CreatedOn datetime,
    CreatedBy varchar(50),
    UpdatedOn datetime,
    UpdatedBy varchar(50),
    PRIMARY KEY (Id),
    UNIQUE (Lat, Lng, TenantId)
)