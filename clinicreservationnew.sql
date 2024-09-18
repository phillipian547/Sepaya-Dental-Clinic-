-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 02, 2024 at 01:35 AM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinicreservationnew`
--

-- --------------------------------------------------------

--
-- Table structure for table `limitis`
--

CREATE TABLE `limitis` (
  `id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `limits`
--

CREATE TABLE `limits` (
  `id` int(10) UNSIGNED NOT NULL,
  `limitValue` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `limits`
--

INSERT INTO `limits` (`id`, `limitValue`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `prescriptionId` int(11) UNSIGNED NOT NULL,
  `prescription` text NOT NULL,
  `diagnosis` text NOT NULL,
  `reservationId` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservationId` int(11) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `time` varchar(175) NOT NULL,
  `status` varchar(175) NOT NULL,
  `prescription` text,
  `diagnosis` text,
  `paid` tinyint(1) NOT NULL,
  `userId` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservationId`, `date`, `time`, `status`, `prescription`, `diagnosis`, `paid`, `userId`) VALUES
(1, '2024-09-11', '', 'approved', NULL, NULL, 0, 37),
(2, '2024-09-12', '', 'pending', NULL, NULL, 0, 39),
(3, '2024-09-12', '', 'approved', NULL, NULL, 0, 37);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) UNSIGNED NOT NULL,
  `username` varchar(175) NOT NULL,
  `password` varchar(250) NOT NULL,
  `passwordText` varchar(175) NOT NULL,
  `role` varchar(175) NOT NULL,
  `firstName` varchar(250) NOT NULL,
  `lastName` varchar(175) NOT NULL,
  `middleInitial` varchar(175) NOT NULL,
  `patientAddress` varchar(250) NOT NULL,
  `contactNumber` varchar(250) NOT NULL,
  `gender` varchar(250) NOT NULL,
  `age` varchar(150) NOT NULL,
  `emailAddress` varchar(175) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `password`, `passwordText`, `role`, `firstName`, `lastName`, `middleInitial`, `patientAddress`, `contactNumber`, `gender`, `age`, `emailAddress`) VALUES
(12, 'admin', '$2a$12$32.0ORP.nXR7jI5FQ8OPpeKNa1OhcDfRbYcUyfECWM51RuC.xmxZ.', 'test@*05', 'admin', 'sdsds', '', '', 'sdsdsdsd', '343434', 'Male', '34', ''),
(37, '1a9RqE', '$2a$12$BdGvYciFHUahLUPNc4/3fuioT5EWVcSazRBkT3XutmMKP/kFZq3PK', 'RS9xDdy', 'user', 'Richell', 'Rose', 'B', 'Cabatuan', '48587458745', 'Male', '34', 'richellerose0818@gmail.com'),
(39, 'BWh3EF', '$2a$12$YXfYxVwgQozdLhrkGNGjse9SoQThavnKL4YmPSvIGGFdXqMwBndci', '5i6bHQ6', 'user', 'mark', 'Boribor', 'B', 'Janiuay', '94584958945', 'Male', '34', 'mark.boribor73@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `limitis`
--
ALTER TABLE `limitis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `limits`
--
ALTER TABLE `limits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`prescriptionId`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservationId`),
  ADD KEY `reserveFkUserId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `limitis`
--
ALTER TABLE `limitis`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `limits`
--
ALTER TABLE `limits`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `prescriptionId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservationId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reserveFkUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
