-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 03 juin 2023 à 09:42
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `chalets`
--

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `nom` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `prenom` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `telephone` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `personnes` int NOT NULL,
  `calendrier` int NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id`, `title`, `nom`, `prenom`, `email`, `telephone`, `personnes`, `calendrier`, `start`, `end`) VALUES
(62, 'aa', 'a', 'a', 'a', 'a', 0, 0, '2023-06-09', '2023-06-10'),
(61, 'a', 'a', 'a', 'a', 'a', 0, 0, '2023-06-08', '2023-06-09'),
(57, 'a', 'a', 'a', 'a', 'a', 0, 0, '2023-07-04', '2023-07-05'),
(56, 'a', 'a', 'a', 'a', 'a', 0, 0, '2023-07-05', '2023-07-06'),
(59, 'a', 'a', 'a', 'a', '2', 2, 0, '2023-06-30', '2023-07-01'),
(55, 'rr', 'rr', 'rr', 'rr', 'rr', 0, 0, '2023-06-29', '2023-06-30'),
(63, 'a', 'a', 'a', 'a', 'a', 2, 0, '2023-07-14', '2023-07-15'),
(64, 'a', 'a', 'a', 'a', '2', 2, 1, '2023-06-01', '2023-06-02'),
(65, 'a', 'a', 'a', 'a', '2', 44, 2, '2023-06-02', '2023-06-03'),
(66, 'a', 'a', 'a', 'a', 'a', 0, 1, '2023-06-29', '2023-06-30'),
(67, 'a', 'a', 'a', 'a', 'a', 0, 0, '2023-07-11', '2023-07-12'),
(68, 'a', 'a', 'a', 'a', '44', 2, 44, '2023-07-18', '2023-07-19'),
(69, 'a', 'a', 'a', 'a', '44', 44, 1, '2023-08-01', '2023-08-02');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
