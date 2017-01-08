/*
部署後指令碼樣板							
--------------------------------------------------------------------------------------
 此檔案包含要附加到組建指令碼的 SQL 陳述式		
 使用 SQLCMD 語法可將檔案包含在部署後指令碼中			
 範例:      :r .\myfile.sql								
 使用 SQLCMD 語法可參考部署後指令碼中的變數		
 範例:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

sp_configure 'show advanced options', 1;
GO
RECONFIGURE;
GO
sp_configure 'clr enabled', 1;
GO
RECONFIGURE;
GO

delete from CompUser where CompID = '79ADD2A0-C1D1-425C-93DF-A084354264BD';
delete from UserInfo where CompID ='79ADD2A0-C1D1-425C-93DF-A084354264BD';
delete from CompUsingD where CompID = '79ADD2A0-C1D1-425C-93DF-A084354264BD';
delete from CompUsingM where CompID = '79ADD2A0-C1D1-425C-93DF-A084354264BD';
delete from SuccOrder where compid = '79ADD2A0-C1D1-425C-93DF-A084354264BD';
delete from Company where CompID = '79ADD2A0-C1D1-425C-93DF-A084354264BD';


insert into Company (CompID,ShortName,TimeZone,CreatedBy,CreatedOn,isOutSource,isPersonal,IsActive,LogoPath,CityCode)
values('79ADD2A0-C1D1-425C-93DF-A084354264BD','Back','8','5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5',getDate(),0,0,1,'/Upload/File/79add2a0-c1d1-425c-93df-a084354264bd/chrome.png',0);
insert into UserInfo (UserID,CompID,LastName,FirstName,Birthday,PhotoColor,loginEmail,loginPW,IsActive,CreatedOn)
values('5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5','79ADD2A0-C1D1-425C-93DF-A084354264BD','客服','人員','2014-11-27','#f17b60','mailplusdev@gmail.com','RgirHm5fac0=',1,GETDATE());
INSERT INTO [dbo].[CompUser] ([UserID],[CompID],[LastName],[FirstName],[CreatedOn],[CreatedBy],[isBoss],[isMail],[isActive],[isOutSource],[isPersonal])
VALUES('5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5' , '79ADD2A0-C1D1-425C-93DF-A084354264BD' ,'客服' , '人員',GETDATE(),'5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5',0,0,1,0,0);
--insert into CompUsingD(CompID,CTDate,SubjCT,SubjReplyCT,StorageCT) 
--values('79ADD2A0-C1D1-425C-93DF-A084354264BD' ,GETDATE(),0,0,0);

--INSERT dbo.SuccOrder
--        ( OdNo ,
--          CompID ,
--          PdNo ,
--          OdOn ,
--          OdSday ,
--          OdEday ,
--          PdType ,
--          PdIntro ,
--          PdStorage ,
--          PdStaff ,
--          PdDisc ,
--          PdAttach ,
--          PdDateRange ,
--          PdPrice ,
--          isActive ,
--          CreatedBy ,
--          CreatedOn ,
--          Salesman ,
--          isPay ,
--          Memo
--        )
--		SELECT NEWID(),com.CompID,'A2BC6F1E-5B97-41A4-96E2-CCB443C3326B',GETDATE(),GETDATE(),NULL,200,'公有雲付費版',0,0,0,0,0,0.00,1,'5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5',GETDATE(),'5CAA1316-E5CD-4AD8-A9BF-800D4E9212B5',1,'' FROM dbo.Company com WHERE IsActive=1

GO
