CREATE PROCEDURE insertSingleuser( @id VARCHAR(80), @email VARCHAR(200), @password VARCHAR(200),@name VARCHAR(200))
 AS
 BEGIN
 INSERT INTO UsersTable(id,email,password,name) VALUES(@id, @email, @password,@name)
 END