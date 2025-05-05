CREATE DATABASE  IF NOT EXISTS `smartmart` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smartmart`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: smartmart
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category_id` int NOT NULL,
  `brand` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_products_categories_idx` (`category_id`),
  CONSTRAINT `fk_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Samsung 65\" QLED TV','65-inch 4K Smart TV with HDR and quantum dot technology',129999.00,1,'Samsung'),(2,'LG OLED55C1','55-inch OLED 4K Smart TV with AI ThinQ and G-Sync compatibility',149999.00,1,'LG'),(3,'Sony Bravia XR','65-inch 8K LED Smart TV with cognitive processor XR',189999.00,1,'Sony'),(4,'LG French Door Refrigerator','26.2 cu. ft. smart refrigerator with ice maker and door-in-door',219999.00,2,'LG'),(5,'Samsung Family Hub','27 cu. ft. smart refrigerator with touchscreen and cameras',279999.00,2,'Samsung'),(6,'Whirlpool Side-by-Side','25 cu. ft. fingerprint resistant stainless steel refrigerator',149999.00,2,'Whirlpool'),(7,'Dell XPS 15','15.6-inch touchscreen laptop with Intel i9 and 32GB RAM',199999.00,3,'Dell'),(8,'MacBook Pro 16','16-inch laptop with M1 Pro chip and 16GB unified memory',249999.00,3,'Apple'),(9,'Lenovo ThinkPad X1','14-inch business laptop with Intel i7 and 16GB RAM',169999.00,3,'Lenovo'),(10,'Panasonic Countertop Microwave','1.3 cu. ft. 1100W microwave with inverter technology',17999.00,4,'Panasonic'),(11,'GE Profile Smart Microwave','1.7 cu. ft. convection microwave with scan-to-cook technology',34999.00,4,'GE'),(12,'Samsung Countertop Microwave','1.1 cu. ft. microwave with sensor cooking',15999.00,4,'Samsung'),(13,'iPhone 13 Pro Max','6.7-inch Super Retina XDR display with ProMotion and A15 Bionic chip',109999.00,5,'Apple'),(14,'Samsung Galaxy S22 Ultra','6.8-inch Dynamic AMOLED 2X with S Pen and 108MP camera',119999.00,5,'Samsung'),(15,'Google Pixel 6 Pro','6.7-inch LTPO OLED with Google Tensor processor and 50MP camera',89999.00,5,'Google');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05 11:02:13
