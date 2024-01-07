-- Table Creation 

-- TaxTypes table
create table TaxTypes
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50) UNIQUE not null,
    Value nvarchar(50),
    Active bit
)

-- TaxGroup table
create table TaxGroup
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50) UNIQUE not null,
    TaxTypeId UNIQUEIDENTIFIER,
    Active bit
)

-- UOM table
create table UOM
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50) UNIQUE not null,
    Value nvarchar(50),
    Active bit
)

-- UOMFactor table

create table UOMFactor
(
    Id UNIQUEIDENTIFIER PRIMARY Key,
    PrimaryUOMId UNIQUEIDENTIFIER,
    SecondaryUOMId UNIQUEIDENTIFIER,
    Factor nvarchar(50),
    Active bit
)

-- ContactAddressType table
create table ContactAddressType
(
    Id UNIQUEIDENTIFIER PRIMARY Key,
    Name nvarchar(50) UNIQUE NOT null,
    Active bit
)

-- ContactDetail table
create table ContactDetail
(
    Id UNIQUEIDENTIFIER Primary key,
    FirstName nvarchar(50),
    LastName nvarchar(50),
    MobileNo nvarchar(50),
    AltMobileNo nvarchar(50),
    Landline1 nvarchar(50),
    Landline2 nvarchar(50),
    Ext1 nvarchar(50),
    Ext2 nvarchar(50),
    ContactAddressTypeId UNIQUEIDENTIFIER,
    Active bit
)

-- AddressDetail table
create table AddressDetail
(
    Id UNIQUEIDENTIFIER Primary key,
    AddressLine1 nvarchar(max),
    AddressLine2 nvarchar(max),
    City nvarchar(50),
    State nvarchar(50),
    Pincode nvarchar(50),
    LocationId UNIQUEIDENTIFIER,
    Landmark nvarchar(max),
    ContactAddressTypeId UNIQUEIDENTIFIER,
    Active bit
)

-- LocationDetail table
create table LocationDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    Lat nvarchar(100),
    Lng nvarchar(100),
    CF1 nvarchar(max),
    CF2 nvarchar(max),
    CF3 nvarchar(max),
    CF4 nvarchar(max)
)

-- CostInfo table
create table CostInfo
(
    Id UNIQUEIDENTIFIER Primary key,
    Amount nvarchar(max),
    TaxGroupId UNIQUEIDENTIFIER,
    IsTaxIncluded bit,
    Active bit
)

-- CategoryDetail
create table CategoryDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50) UNIQUE Not null,
    Active bit
)

-- TransactionTypeConfig table
create table TransactionTypeConfig
(
    Id UNIQUEIDENTIFIER Primary Key,
    StartCounterNo nvarchar(50),
    Prefix nvarchar(50),
    Format nvarchar(max),
    Active bit
)

-- TransactionType table
create table TransactionType
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50),
    TransactionTypeConfigId UNIQUEIDENTIFIER,
    Active bit
)

-- OrganizationDetail table
create table OrganizationDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(100) UNIQUE Not Null,
    Active bit
)

-- BranchDetail table
create table BranchDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    OrganizationDetailId UNIQUEIDENTIFIER,
    ContactDetailId UNIQUEIDENTIFIER,
    AddressDetailId UNIQUEIDENTIFIER,
    TransactionTypeConfigId UNIQUEIDENTIFIER,
    UserGroupId UNIQUEIDENTIFIER,
    BranchName nvarchar(max),
    TINNo nvarchar(50),
    GSTIN nvarchar(50),
    PAN nvarchar(50),
    CF1 nvarchar(max),
    CF2 nvarchar(max),
    CF3 nvarchar(max),
    CF4 nvarchar(max),
    Active bit
)

-- BatchDetail table
create table BatchDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    BatchNo nvarchar(50),
    Barcode nvarchar(max),
    MfgDate date,
    ExpDate date,
    PurchaseDate date,
    IsNonReturnable bit,
    CostInfoId UNIQUEIDENTIFIER,
    ItemId UNIQUEIDENTIFIER,
    UOMId UNIQUEIDENTIFIER,
    Quantity nvarchar(50),
    LocationId UNIQUEIDENTIFIER,
    Active bit
)

-- Item table
create table Item
(
    Id UNIQUEIDENTIFIER Primary key,
    Type nvarchar(50) Not null,
    HSNCode nvarchar(50),
    SKU nvarchar(50),
    BatchDetailId UNIQUEIDENTIFIER,
    CategoryId UNIQUEIDENTIFIER,
    Description nvarchar(max),
    Active bit
)

-- AccountTypeBase table
create table AccountTypeBase
(
    Id UNIQUEIDENTIFIER Primary key,
    Name nvarchar(50) Not null,
    Active bit
)

-- TransactionTypeStatus table
create table TransactionTypeStaus
(
    Id UNIQUEIDENTIFIER Primary Key,
    Name nvarchar(50),
    Active bit
)

-- TransactionTypeBaseConversion table
create table TransactionTypeBaseConversion
(
    Id UNIQUEIDENTIFIER Primary key,
    FromTransactionTypeId UNIQUEIDENTIFIER,
    ToTtansactionTypeId UNIQUEIDENTIFIER,
    Active bit
)

-- TransactionTypeCounter table
create table TransactionTypeCounter
(
    Id UNIQUEIDENTIFIER Primary Key,
    TransactionTypeId UNIQUEIDENTIFIER,
    NextCounterValue nvarchar(50),
    Active bit
)

-- TransactionDetailLog table
create table TransactionDetailLog
(
    Id UNIQUEIDENTIFIER Primary Key,
    AccountTypeBaseId UNIQUEIDENTIFIER,
    UserId UNIQUEIDENTIFIER,
    Timestamp date,
    TransactionTypeId UNIQUEIDENTIFIER,
    TransactionTypeBaseConversionId UNIQUEIDENTIFIER,
    TransactionTypeStatusId UNIQUEIDENTIFIER,
    Description nvarchar(max),
    BranchDetailId UNIQUEIDENTIFIER,
    MapTransactionTypeId UNIQUEIDENTIFIER,
    TransactionTypeCounterId UNIQUEIDENTIFIER,
    CF1 nvarchar(max),
    CF2 nvarchar(max),
    CF3 nvarchar(max),
    CF4 nvarchar(max),
    Active bit
)

-- TransactionItemDetail table
create table TransactionItemDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    TransactionDetailLogId UNIQUEIDENTIFIER,
    ItemId UNIQUEIDENTIFIER,
    TransactionTypeCounterId UNIQUEIDENTIFIER,
    Comment nvarchar(max),
    Active bit
)

-- PaymentReceivedType
create table PaymentReceivedType
(
    Id UNIQUEIDENTIFIER Primary Key,
    Type nvarchar(100) UNIQUE not null,
    Active bit
)

-- PaymentMode table
create table PaymentMode
(
    Id UNIQUEIDENTIFIER Primary Key,
    Type nvarchar(100) UNIQUE not null,
    Active bit
)

-- PaymentModeTransactionDetail table
create table PaymentModeTransactionDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    PaymenyModeId UNIQUEIDENTIFIER,
    RefNo nvarchar(100),
    Comment nvarchar(1000),
    CF1 nvarchar(max),
    CF2 nvarchar(max),
    CF3 nvarchar(max),
    CF4 nvarchar(max)
)

-- PaymentDetail table
create table PaymentDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    AccountTypeBaseId UNIQUEIDENTIFIER,
    TransactionDetailLogId UNIQUEIDENTIFIER,
    DiscountAmount nvarchar(max),
    RoundOff nvarchar(max),
    TotalAmount nvarchar(max),
    TaxesAmount nvarchar(max),
    GrossAmount nvarchar(max),
    UserId UNIQUEIDENTIFIER,
    Timestamp date
)

-- PaymentBreakup table
create table PaymentBreakup
(
    Id UNIQUEIDENTIFIER Primary Key,
    AccountTypeBaseId UNIQUEIDENTIFIER,
    PaymentDetailId UNIQUEIDENTIFIER,
    PaymentModeTransactionDetailId UNIQUEIDENTIFIER,
    PaymentReceivedId UNIQUEIDENTIFIER,
    UserId UNIQUEIDENTIFIER,
    Timestamp date
)

-- AccountTypeBaseProfile table
create table AccountTypeBaseProfile
(
    Id UNIQUEIDENTIFIER Primary Key,
    AccountTypeBaseId UNIQUEIDENTIFIER,
    UserProfileId UNIQUEIDENTIFIER,
    Active bit
)

-- AccountStatus table
create table AccountStatus
(
    Id UNIQUEIDENTIFIER Primary Key,
    Status nvarchar(50) UNIQUE not null,
    Description nvarchar(100),
    Active bit
)

-- UserGroup table
create table UserGroup
(
    Id UNIQUEIDENTIFIER Primary Key,
    GroupName nvarchar(100) UNIQUE not null,
    Description nvarchar(100),
    Active bit
)

-- Users table
create table Users
(
    Id UNIQUEIDENTIFIER PRIMARY Key,
    Username nvarchar(100) UNIQUE Not NULL,
    Password nvarchar(1000) not null,
    Salt nvarchar(1000) not null,
    UserGroupId UNIQUEIDENTIFIER,
    AccountStatusId UNIQUEIDENTIFIER,
    Description nvarchar(100),
    Active bit
)

-- UserProfile table
create table UserProfile
(
    Id UNIQUEIDENTIFIER Primary Key,
    UserId UNIQUEIDENTIFIER,
    AddressDetailId UNIQUEIDENTIFIER,
    ContactDetailId UNIQUEIDENTIFIER,
    Initials nvarchar(50),
    Firstname nvarchar(50),
    Lastname nvarchar(50),
    DOB Date,
    Sex NVARCHAR(20),
    Description nvarchar(100),
    Active bit
)

-- Sessions table
create table Sessions
(
    Id UNIQUEIDENTIFIER Primary Key,
    UserId UNIQUEIDENTIFIER,
    Username nvarchar(1000) Not Null,
    UserGroupId UNIQUEIDENTIFIER,
    SessionExp Date,
    SessionStart Date,
    SessionExtendCount int,
    Active bit
)

-- ApiDetail table
create table ApiDetail
(
    Id UNIQUEIDENTIFIER Primary Key,
    ApiName nvarchar(1000) not null,
    ApiType nvarchar(50) not null,
    Description nvarchar(max),
    Active bit
)

-- UserGroupPermission table 
create table UserGroupPermission
(
    Id UNIQUEIDENTIFIER Primary Key,
    ApiDetailId UNIQUEIDENTIFIER,
    UserGroupId UNIQUEIDENTIFIER,
    Description nvarchar(1000),
    Active bit
)

-- UserGroupLink table
create table UserGroupLink
(
    Id UNIQUEIDENTIFIER Primary key,
    UserId UNIQUEIDENTIFIER,
    UserGroupId UNIQUEIDENTIFIER,
    Active bit
)

-- ErrorLog table
create table ErrorLog
(
    Id UNIQUEIDENTIFIER PRIMARY Key,
    ModuleName nvarchar(100) not null,
    LogType nvarchar(100) not null,
    ErrorMessage nvarchar(max),
    ErrorData nvarchar(max)
)