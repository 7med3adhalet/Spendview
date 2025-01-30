-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2025 at 01:31 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banking_system`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `frequentusers`
-- (See below for the actual view)
--
CREATE TABLE `frequentusers` (
);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `sender_id`, `receiver_id`, `amount`, `transaction_date`) VALUES
(1, 2, 14, 2222.00, '2025-01-16 13:56:45'),
(2, 14, 2, 250.00, '2025-01-16 14:01:04'),
(3, 2, 15, 500.00, '2025-01-16 14:11:47'),
(4, 2, 14, 200.00, '2025-01-16 14:56:26'),
(5, 2, 14, 200.00, '2025-01-16 21:49:17'),
(6, 2, 14, 123.00, '2025-01-16 21:54:09'),
(7, 2, 16, 123.00, '2025-01-16 21:56:19'),
(8, 2, 14, 250.00, '2025-01-17 11:59:30'),
(9, 2, 16, 250.00, '2025-01-20 10:52:19'),
(10, 2, 15, 12.00, '2025-01-20 11:06:48'),
(11, 2, 17, 120.00, '2025-01-21 11:40:26'),
(12, 17, 2, 100.00, '2025-01-21 11:44:21'),
(13, 2, 15, 0.33, '2025-01-22 06:47:58'),
(14, 2, 21, 500.00, '2025-01-22 06:53:12'),
(15, 21, 15, 50.00, '2025-01-22 06:54:09'),
(16, 2, 14, 250.00, '2025-01-26 18:00:04'),
(17, 22, 2, 250.00, '2025-01-26 18:17:37'),
(18, 2, 23, 500.00, '2025-01-30 11:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE `userinfo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_of_birth` date NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `phone_number` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `account_creation_date` date DEFAULT curdate(),
  `monthly_income` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`id`, `user_id`, `date_of_birth`, `balance`, `phone_number`, `address`, `account_creation_date`, `monthly_income`) VALUES
(1, 2, '2004-03-17', 258388.25, '25936640', '6 rue aziza othmana hammemchatt', '2025-01-14', 12.00),
(3, 1, '2025-01-09', 321.00, '123123123', 'saasfzxc', '2025-01-14', NULL),
(4, 12, '0000-00-00', 0.00, '0', '', '2025-01-15', NULL),
(5, 13, '0000-00-00', 0.00, '0', '', '2025-01-15', NULL),
(6, 14, '2025-01-14', 1623.00, '12345678', 'hammemchatt', '2025-01-16', NULL),
(7, 15, '0000-00-00', 562.33, '0', '', '2025-01-16', NULL),
(8, 16, '1899-11-29', 1373.00, '0', '', '2025-01-16', NULL),
(9, 17, '0000-00-00', 20.00, '0', '', '2025-01-21', NULL),
(10, 18, '0000-00-00', 0.00, '0', '', '2025-01-21', NULL),
(11, 19, '0000-00-00', 0.00, '0', '', '2025-01-21', 0.00),
(12, 20, '2005-02-15', 0.00, '0', '', '2025-01-21', 0.00),
(13, 21, '0000-00-00', 450.00, '0', '', '2025-01-22', 0.00),
(14, 22, '2016-11-11', 249750.00, '911', '', '2025-01-26', 0.00),
(15, 23, '0000-00-00', 500.00, '0', '', '2025-01-30', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`) VALUES
(1, 'John Doe', 'john@example.com', 'password123'),
(2, 'zakaria aissa', 'admin', 'admin'),
(3, 'zakaria', 'zakaria.aissa00@gmail.com', 'sasa'),
(4, 'hmed', 'hmed@gmail.com', 'hmed'),
(5, 'asd', 'asd', 'asd'),
(6, 'ss', 'ss', 'ss'),
(7, 'ssw', 'ssw', 'ssw'),
(8, 'test', 'test', 'test'),
(9, 'zaineb', 'z', 'z'),
(10, 'zaineb', 'z@gmail.com', 'zzz'),
(11, 'zbib', 'zbib', 'zz'),
(12, 'alo', 'alo', 'alo'),
(13, 'zein', 'zeineb.aissa1995@gmail.com', '123123'),
(14, 'testm', 'testm', 'test'),
(15, 'kawther', 'kawther1968@gmail.com', '123'),
(16, 'hello', 'hello@gmail.com', 'hello'),
(17, 'user1', 'user1@gmail.com', 'user1'),
(18, 'user2', 'user2@gmail.com', 'user2'),
(19, '', '', ''),
(20, 'user3', 'user3@gmail.com', 'user3'),
(21, 'user5', 'user5@gmail.com', 'user5'),
(22, 'test', 'testss', 'ss'),
(23, 'tester', 'tester', 'tester');

-- --------------------------------------------------------

--
-- Structure for view `frequentusers`
--
DROP TABLE IF EXISTS `frequentusers`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `frequentusers`  AS SELECT `transactions`.`recipient_name` AS `recipient_name`, count(0) AS `transfers` FROM `transactions` GROUP BY `transactions`.`recipient_name` ORDER BY count(0) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD CONSTRAINT `userinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
