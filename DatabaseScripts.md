# Database Documentation
## Commands Used to Build Database
#### Create Tables (while in COP4331 database)
CREATE TABLE `Users`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`DateLastLoggedIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Login` VARCHAR(50) NOT NULL DEFAULT '' ,
`Password` VARCHAR(50) NOT NULL DEFAULT '' ,
PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
CREATE TABLE `Contacts`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Phone` VARCHAR(50) NOT NULL DEFAULT '' ,
`Email` VARCHAR(50) NOT NULL DEFAULT '' ,
`UserID` INT NOT NULL DEFAULT '0' ,
PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

#### Add people to Users table
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Rick','Leinecker','RickL','COP4331');
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Sam','Hill','SamH','Test');
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2');
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b');

#### Add contacts to Contacts table (must be after creating users to match UserIDs)
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Charlie', 'Dompler', '4073429384', 'charlied@gmail.com', '1');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Pim', 'Pimling', '3215687391', 'pimling@yahoo.com', '1');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Charlie', 'Dompler', '4073429384', 'charlied@gmail.com', '2');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Mr.', 'Frog', '8442003111', 'ahhhhhhhhh@gmail.com', '2');
INSERT INTO Contacts (FirstName, Phone, Email, UserID) VALUES ('Glep', '1234567890', 'glepglep@glep.com', '2');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Pim', 'Pimling', '3215687391', 'pimling@yahoo.com', '3');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Mr.', 'Boss', '3597544463', 'theboss@aol.com', '3');
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('Charlie', 'Dompler', '4073429384', 'charlied@gmail.com', '4');