-- Fix equipmentgroupfamily indexes redefinition (safe for prod)

SET @db = DATABASE();

SET @drop_name = (
  SELECT COUNT(*) FROM information_schema.STATISTICS 
  WHERE table_schema = @db
  AND table_name = 'equipmentgroupfamily' 
  AND index_name = 'equipmentGroupFamily_name_key'
);

SET @drop_numref = (
  SELECT COUNT(*) FROM information_schema.STATISTICS 
  WHERE table_schema = @db
  AND table_name = 'equipmentgroupfamily' 
  AND index_name = 'equipmentGroupFamily_numRef_key'
);

SET @sql1 = IF(@drop_name > 0, 
  'DROP INDEX `equipmentGroupFamily_name_key` ON `equipmentgroupfamily`', 
  'SELECT 1');

SET @sql2 = IF(@drop_name > 0, 
  'CREATE UNIQUE INDEX `equipmentgroupfamily_name_key` ON `equipmentgroupfamily`(`name`)', 
  'SELECT 1');

SET @sql3 = IF(@drop_numref > 0, 
  'DROP INDEX `equipmentGroupFamily_numRef_key` ON `equipmentgroupfamily`', 
  'SELECT 1');

SET @sql4 = IF(@drop_numref > 0, 
  'CREATE UNIQUE INDEX `equipmentgroupfamily_numRef_key` ON `equipmentgroupfamily`(`numRef`)', 
  'SELECT 1');

PREPARE stmt1 FROM @sql1; EXECUTE stmt1; DEALLOCATE PREPARE stmt1;
PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;
PREPARE stmt3 FROM @sql3; EXECUTE stmt3; DEALLOCATE PREPARE stmt3;
PREPARE stmt4 FROM @sql4; EXECUTE stmt4; DEALLOCATE PREPARE stmt4;