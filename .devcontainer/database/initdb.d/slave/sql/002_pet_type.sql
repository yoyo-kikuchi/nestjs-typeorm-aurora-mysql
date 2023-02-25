USE sample;

CREATE TABLE `m_pet_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` char(3) NOT NULL,
  `value` varchar(256) NOT NULL,
  `create_user_cd` varchar(8) NOT NULL DEFAULT 'SYSTEM',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_user_cd` varchar(8) NOT NULL DEFAULT 'SYSTEM',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_pet_type_uq_01` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

INSERT INTO `m_pet_type` (`code`, `value`) VALUES
('001', '猫'),
('002', '犬');