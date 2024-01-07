-- Table Creation 

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
    Decription nvarchar(1000),
    Active bit
)

-- Users table
create table Users
(
    Id UNIQUEIDENTIFIER Primary Key,
    Username nvarchar(100) UNIQUE Not null,
    Password nvarchar(100) not null,
    Salt nvarchar(100) not null,
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
    Middlename nvarchar(50),
    DOB date,
    Sex navarchar(20),
    Description nvarchar(100),
    Active bit
)

-- Sessions Table
create table Sessions
(
    Id UNIQUEIDENTIFIER Primary Key,
    UserId UNIQUEIDENTIFIER,
    Username nvarchar(100) not null,
    UserGroupId UNIQUEIDENTIFIER,
    SessionExp date Not null,
    SessionStart date not null,
    SessionExtendCount int not null,
    Active bit
)

-- ApiDetail Table
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
    Id UNIQUEIDENTIFIER Primary Key,
    UserId UNIQUEIDENTIFIER,
    UserGroupId UNIQUEIDENTIFIER,
    Description nvarchar(1000),
    Active bit
)

-- ErrorLog table
create table ErrorLog
(
    Id UNIQUEIDENTIFIER Primary Key,
    ModuleName nvarchar(100) not null,
    LogType nvarchar(100) not null,
    ErrorMessage nvarchar(max),
    ErrorData nvarchar(max)
)