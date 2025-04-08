BEGIN TRANSACTION;
DROP TABLE IF EXISTS "AspNetRoleClaims";
CREATE TABLE "AspNetRoleClaims" (
	"Id"	INTEGER NOT NULL,
	"RoleId"	TEXT NOT NULL,
	"ClaimType"	TEXT,
	"ClaimValue"	TEXT,
	CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY("Id" AUTOINCREMENT),
	CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY("RoleId") REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetRoles";
CREATE TABLE "AspNetRoles" (
	"Id"	TEXT NOT NULL,
	"Name"	TEXT,
	"NormalizedName"	TEXT,
	"ConcurrencyStamp"	TEXT,
	CONSTRAINT "PK_AspNetRoles" PRIMARY KEY("Id")
);
DROP TABLE IF EXISTS "AspNetUserClaims";
CREATE TABLE "AspNetUserClaims" (
	"Id"	INTEGER NOT NULL,
	"UserId"	TEXT NOT NULL,
	"ClaimType"	TEXT,
	"ClaimValue"	TEXT,
	CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY("Id" AUTOINCREMENT),
	CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserLogins";
CREATE TABLE "AspNetUserLogins" (
	"LoginProvider"	TEXT NOT NULL,
	"ProviderKey"	TEXT NOT NULL,
	"ProviderDisplayName"	TEXT,
	"UserId"	TEXT NOT NULL,
	CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY("LoginProvider","ProviderKey"),
	CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserRoles";
CREATE TABLE "AspNetUserRoles" (
	"UserId"	TEXT NOT NULL,
	"RoleId"	TEXT NOT NULL,
	CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY("UserId","RoleId"),
	CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY("RoleId") REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
	CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserTokens";
CREATE TABLE "AspNetUserTokens" (
	"UserId"	TEXT NOT NULL,
	"LoginProvider"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY("UserId","LoginProvider","Name"),
	CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUsers";
CREATE TABLE "AspNetUsers" (
	"Id"	TEXT NOT NULL,
	"UserName"	TEXT,
	"NormalizedUserName"	TEXT,
	"Email"	TEXT,
	"NormalizedEmail"	TEXT,
	"EmailConfirmed"	INTEGER NOT NULL,
	"PasswordHash"	TEXT,
	"SecurityStamp"	TEXT,
	"ConcurrencyStamp"	TEXT,
	"PhoneNumber"	TEXT,
	"PhoneNumberConfirmed"	INTEGER NOT NULL,
	"TwoFactorEnabled"	INTEGER NOT NULL,
	"LockoutEnd"	TEXT,
	"LockoutEnabled"	INTEGER NOT NULL,
	"AccessFailedCount"	INTEGER NOT NULL,
	CONSTRAINT "PK_AspNetUsers" PRIMARY KEY("Id")
);
DROP TABLE IF EXISTS "__EFMigrationsHistory";
CREATE TABLE "__EFMigrationsHistory" (
	"MigrationId"	TEXT NOT NULL,
	"ProductVersion"	TEXT NOT NULL,
	CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY("MigrationId")
);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('28dbd6a7-fff9-4d11-9f9c-98c1b517ff2b','test@test.com','TEST@TEST.COM','test@test.com','TEST@TEST.COM',0,'AQAAAAIAAYagAAAAEBNI1G0DSFEM7R9kSUsoyHUqCD6kNiBJOnfQYiVEQeMHxnnIFgbnxLXkBrdmhPIdww==','MFYTHOCCHLZHLAF5HSIZJMQBME7WZOGZ','74ff16a4-3a76-40c5-b6b5-3cd7196a29a6',NULL,0,0,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('5fa05b4a-37eb-4da9-b404-c1363e3c7b6a','tester@test.com','TESTER@TEST.COM','tester@test.com','TESTER@TEST.COM',0,'AQAAAAIAAYagAAAAENKBHOelggA6W7jA2ueKVAZj3WLgYSkPgBdZWE2ZinFasC4PNACujh1QgRWT017xww==','RMLSQMOHXT4IJFKA5EJCYM3XCNO36ODV','2587a24a-40c2-4ef1-a747-456eb05ee158',NULL,0,0,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('5c7822fe-ce32-418f-9779-e5b3904a4cd1','test1@test.com','TEST1@TEST.COM','test1@test.com','TEST1@TEST.COM',0,'AQAAAAIAAYagAAAAEByy9x1NKOQhFTel3EpEqJN1YcwtbkHQFO2LJXgjlBQcUOObEYEoRBu0QLTspPTkPQ==','I2BQWONGDLRHEF2S5IHNAW37F74BTB6A','4c314a8a-e675-49b0-bdac-4e7d60efea51',NULL,0,0,NULL,1,0);
INSERT INTO "__EFMigrationsHistory" ("MigrationId","ProductVersion") VALUES ('20250407045504_InitialCreate','8.0.13');
DROP INDEX IF EXISTS "EmailIndex";
CREATE INDEX "EmailIndex" ON "AspNetUsers" (
	"NormalizedEmail"
);
DROP INDEX IF EXISTS "IX_AspNetRoleClaims_RoleId";
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" (
	"RoleId"
);
DROP INDEX IF EXISTS "IX_AspNetUserClaims_UserId";
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" (
	"UserId"
);
DROP INDEX IF EXISTS "IX_AspNetUserLogins_UserId";
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" (
	"UserId"
);
DROP INDEX IF EXISTS "IX_AspNetUserRoles_RoleId";
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" (
	"RoleId"
);
DROP INDEX IF EXISTS "RoleNameIndex";
CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" (
	"NormalizedName"
);
DROP INDEX IF EXISTS "UserNameIndex";
CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" (
	"NormalizedUserName"
);
COMMIT;
