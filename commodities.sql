-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 20, 2023 at 03:39 AM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `322`
--

-- --------------------------------------------------------

--
-- Table structure for table `commodities`
--

CREATE TABLE `commodities` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `information` varchar(150) NOT NULL,
  `code` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `commodities`
--

INSERT INTO `commodities` (`id`, `name`, `information`, `code`) VALUES
(1, 'Corn', ' Global price of Corn', 'CORN'),
(2, 'Cotton', 'Global price of Cotton', 'COTTON'),
(3, 'Sugar', 'Global price of Sugar, No. 11, World,', 'SUGAR'),
(4, 'Copper', 'Global price of Copper', 'COPPER'),
(5, 'Aluminium', 'Global price of Aluminum', 'ALUMINUM'),
(6, 'Wheat', 'Global price of Wheat', 'WHEAT'),
(7, 'Coffee', 'Global price of Coffee, Other Mild Arabica', 'COFFEE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commodities`
--
ALTER TABLE `commodities`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commodities`
--
ALTER TABLE `commodities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
