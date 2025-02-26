-- Create schema Shop.
DROP DATABASE IF EXISTS `Shop`;
CREATE DATABASE `Shop`;

-- Create M_USERS table.
DROP TABLE IF EXISTS `Shop`.`M_USERS`;
CREATE TABLE `Shop`.`M_USERS` (
  `USER_ID` VARCHAR(36) NOT NULL,
  `USER_FIRST_NAME` VARCHAR(12) NOT NULL,
  `USER_LAST_NAME` VARCHAR(36) NOT NULL,
  `USER_NAME` VARCHAR(36) NOT NULL,
  `USER_EMAIL` VARCHAR(64) NOT NULL,
  `USER_PASSWORD` VARCHAR(64) NOT NULL,
  `USER_PHONE_NUMBER` VARCHAR(10) NOT NULL,
  `USER_ADDRESS` VARCHAR(64) NOT NULL,
  `USER_DELETE_FLG` INT NOT NULL,
  `USER_VERIFY` INT NOT NULL,
  `USER_VERIFY_TOKEN` INT,
  `USER_TOKEN_EXPIRATION` BIGINT,
  `USER_CREATED_BY` VARCHAR(36) NOT NULL,
  `USER_CREATED_AT` BIGINT NOT NULL,
  `USER_CREATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  `USER_UPDATED_BY` VARCHAR(36) NOT NULL,
  `USER_UPDATED_AT` BIGINT NOT NULL,
  `USER_UPDATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE INDEX `USER_ID_UNIQUE` (`USER_ID` ASC) VISIBLE,
  UNIQUE INDEX `USER_NAME_UNIQUE` (`USER_NAME` ASC) VISIBLE,
  UNIQUE INDEX `USER_EMAIL_UNIQUE` (`USER_EMAIL` ASC) VISIBLE
);

-- Create M_ROLES table.
DROP TABLE IF EXISTS `Shop`.`M_ROLES`;
CREATE TABLE `Shop`.`M_ROLES` (
  `ROLE_ID` INT NOT NULL,
  `ROLE_NAME` VARCHAR(16) NOT NULL,
  `ROLE_DELETE_FLG` INT NOT NULL,
  `ROLE_CREATED_BY` VARCHAR(36) NOT NULL,
  `ROLE_CREATED_AT` BIGINT NOT NULL,
  `ROLE_CREATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  `ROLE_UPDATED_BY` VARCHAR(36) NOT NULL,
  `ROLE_UPDATED_AT` BIGINT NOT NULL,
  `ROLE_UPDATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  PRIMARY KEY (`ROLE_ID`),
  UNIQUE INDEX `ROLE_ID_UNIQUE` (`ROLE_ID` ASC) VISIBLE
);

-- Create R_USER_ROLES table.
DROP TABLE IF EXISTS `Shop`.`R_USERS_ROLES`;
CREATE TABLE `Shop`.`R_USERS_ROLES` (
  `USER_ID` VARCHAR(36) NOT NULL,
  `ROLE_ID` INT NOT NULL,
  `DELETE_FLG` INT NOT NULL,
  `CREATED_BY` VARCHAR(36) NOT NULL,
  `CREATED_AT` BIGINT NOT NULL,
  `CREATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  `UPDATED_BY` VARCHAR(36) NOT NULL,
  `UPDATED_AT` BIGINT NOT NULL,
  `UPDATED_AT_SYSTEM` TIMESTAMP NOT NULL,
  PRIMARY KEY (`USER_ID`, `ROLE_ID`),
  FOREIGN KEY (`USER_ID`) REFERENCES `Shop`.`M_USERS`(`USER_ID`),
  FOREIGN KEY (`ROLE_ID`) REFERENCES `Shop`.`M_ROLES`(`ROLE_ID`)
);

-- Add foreign keys R_USER_ROLES table.
ALTER TABLE `Shop`.`R_USERS_ROLES`
	ADD CONSTRAINT `FK_R_USERS_ROLE` FOREIGN KEY (`USER_ID`) REFERENCES `Shop`.`M_USERS`(`USER_ID`) ON DELETE CASCADE,
	ADD CONSTRAINT `FK_R_ROLES_USER` FOREIGN KEY (`ROLE_ID`) REFERENCES `Shop`.`M_ROLES`(`ROLE_ID`);

-- ========== TRIGGERS ==========
-- Update R_USERS_ROLES when a M_ROLES's row is deleted.
DROP TRIGGER IF EXISTS `Shop`.`before_delete_role`;
DELIMITER $$
CREATE TRIGGER `Shop`.`before_delete_role`
BEFORE DELETE ON `Shop`.`M_ROLES`
FOR EACH ROW
BEGIN
    -- Update DELETE_FLG in R_USER_ROLES if row is deleted
    UPDATE `Shop`.`R_USERS_ROLES`
    SET `DELETE_FLG` = 1 -- The value will change
    WHERE `ROLE_ID` = OLD.ROLE_ID;
END$$
DELIMITER ;

-- Update R_USERS_ROLES when ROLE_DELETE_FLG or ROLE_ID of M_ROLES's field is change.
DROP TRIGGER IF EXISTS `Shop`.`after_update_roles`;
DELIMITER $$
CREATE TRIGGER `Shop`.`after_update_roles`
AFTER UPDATE ON `Shop`.`M_ROLES`
FOR EACH ROW
BEGIN
	IF OLD.ROLE_DELETE_FLG != NEW.ROLE_DELETE_FLG THEN
        -- Update DELETE_FLG to 1 when ROLE_DELETE_FLG is changed to 1
        UPDATE `Shop`.`R_USERS_ROLES`
        SET `DELETE_FLG` = NEW.ROLE_DELETE_FLG -- The value will change
        WHERE `ROLE_ID` = OLD.ROLE_ID;

    ELSEIF OLD.ROLE_ID != NEW.ROLE_ID THEN
        -- Update ROLE_ID in R_USER_ROLES if ROLE_ID is changed
        UPDATE `Shop`.`R_USERS_ROLES`
        SET `ROLE_ID` = NEW.ROLE_ID -- The value will change
        WHERE `ROLE_ID` = OLD.ROLE_ID;
    END IF;
END$$
DELIMITER ;

-- Update R_USERS_ROLES when USER_DELETE_FLG of M_USERS's field is change.
DROP TRIGGER IF EXISTS `Shop`.`after_update_user`;
DELIMITER $$
CREATE TRIGGER `Shop`.`after_update_user`
AFTER UPDATE ON `Shop`.`M_USERS`
FOR EACH ROW
BEGIN
	IF OLD.USER_DELETE_FLG != NEW.USER_DELETE_FLG THEN
        -- Update DELETE_FLG to 1 when USER_DELETE_FLG is changed to 1
        UPDATE `Shop`.`R_USERS_ROLES`
        SET `DELETE_FLG` = NEW.USER_DELETE_FLG -- The value will change
        WHERE `USER_ID` = OLD.USER_ID;
    END IF;
END$$
DELIMITER ;

-- ========== INSERT DATA ==========
-- Insert data for M_ROLES
INSERT INTO `Shop`.`M_ROLES` (`ROLE_ID`, `ROLE_NAME`, `ROLE_DELETE_FLG`, `ROLE_CREATED_AT`, `ROLE_CREATED_AT_SYSTEM`, `ROLE_UPDATED_AT`, `ROLE_UPDATED_AT_SYSTEM`) 
VALUES  ('1001', 'Admin', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('1002', 'Shop', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('1003', 'Buyer', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('1004', 'Shipper', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19');

-- Insert data for M_USERS        
INSERT INTO `Shop`.`M_USERS` (`USER_ID`, `USER_FIRST_NAME`, `USER_LAST_NAME`, `USER_NAME`, `USER_EMAIL`, `USER_PASSWORD`, `USER_PHONE_NUMBER`, `USER_ADDRESS`, `USER_DELETE_FLG`, `USER_VERIFY`, `USER_VERIFY_TOKEN`, `USER_TOKEN_EXPIRATION`, `USER_CREATED_BY`, `USER_CREATED_AT`, `USER_CREATED_AT_SYSTEM`, `USER_UPDATED_BY`, `USER_UPDATED_AT`, `USER_UPDATED_AT_SYSTEM`)
VALUES  ('S10001', 'Admin', 'Phạm', 'admin', 'admin@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('S10002', 'Shop1', 'Nguyễn', 'shop1', 'shop1@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10003', 'Shop2', 'Phạm', 'shop2', 'shop2@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10004', 'Buyer1', 'Nguyễn', 'buyer1', 'buyer1@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10005', 'Buyer2', 'Phạm', 'buyer2', 'buyer2@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10006', 'Buyer3', 'Quốc', 'buyer3', 'buyer3@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10007', 'Buyer4', 'Huỳnh', 'buyer4', 'buyer4@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10008', 'Buyer5', 'Trương', 'buyer5', 'buyer5@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10009', 'Buyer6', 'Trần', 'buyer6', 'buyer6@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10010', 'Shipper1', 'Nguyễn', 'shipper1', 'shipper1@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10011', 'Shipper2', 'Phạm', 'shipper2', 'shipper2@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10012', 'Taan', 'Phạm Ngọc', 'ngoctan2k1', 'phamngoctan2016@gmail.com', '123456', '0386158494', 'Quảng Ngãi', '0', '0', '', '', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19');

-- Insert data for M_USERS_ROLES   
INSERT INTO `Shop`.`R_USERS_ROLES` (`USER_ID`, `ROLE_ID`, `DELETE_FLG`,`CREATED_BY`, `CREATED_AT`, `CREATED_AT_SYSTEM`,`UPDATED_BY`, `UPDATED_AT`, `UPDATED_AT_SYSTEM`)
VALUES  ('S10001', '1001', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('S10002', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10002', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10002', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10003', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10003', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('S10004', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10004', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10004', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10005', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10005', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('S10006', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10006', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10007', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10008', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10008', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10009', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10010', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
		('S10010', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10011', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10011', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10012', '1001', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10012', '1002', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10012', '1003', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19'),
        ('S10012', '1004', '0', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19', 'SYSTEM', '1738999819000', '2025-02-08 14:30:19');