/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : localhost:3306
 Source Schema         : note

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 11/08/2019 17:35:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for note_admin
-- ----------------------------
DROP TABLE IF EXISTS `note_admin`;
CREATE TABLE `note_admin`  (
  `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `access_token` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'AccessToken',
  `access_token_expire` int(10) NOT NULL DEFAULT 0 COMMENT 'AccessToken过期时间',
  `created` int(10) NOT NULL DEFAULT 0 COMMENT '创建时间',
  `status` int(10) NULL DEFAULT NULL COMMENT '用户状态',
  `last_login_time` int(11) NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '最后登录ip',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `mobile_code` int(11) NULL DEFAULT NULL COMMENT '验证码',
  `mobile_code_expire` int(11) NULL DEFAULT NULL COMMENT '验证码截截止时间',
  `mobile_error` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '验证码返回错误',
  `sms_expire_sec` int(11) NULL DEFAULT NULL COMMENT '验证码有效时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '管理员表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of note_admin  default password abc.123
-- ----------------------------
INSERT INTO `note_admin` VALUES (1, 'admin', 'e511341dc05782269d3d859b5ff3939b', '5JOKtzOje1pP-f1jDKL-1cdiTBnJ_kx9', 1563776878, 0, 1, 1563771757, '', '', 0, 0, '');

-- ----------------------------
-- Table structure for note_categories
-- ----------------------------
DROP TABLE IF EXISTS `note_categories`;
CREATE TABLE `note_categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分类名称',
  `modified` int(11) NULL DEFAULT NULL COMMENT '修改时间',
  `created` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `status` int(11) NULL DEFAULT NULL COMMENT '分类状态',
  `parent_id` int(11) NULL DEFAULT 0 COMMENT '父级id',
  `icon` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '图标名称',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `status`(`status`, `parent_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for note_posts
-- ----------------------------
DROP TABLE IF EXISTS `note_posts`;
CREATE TABLE `note_posts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章标题',
  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '文章内容',
  `content_filter` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '文章内容[去除图片]',
  `modified` int(11) NULL DEFAULT NULL COMMENT '修改时间',
  `created` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `type` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章类型',
  `status` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章状态',
  `category` int(11) NULL DEFAULT NULL COMMENT '分类id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for note_posts_history
-- ----------------------------
DROP TABLE IF EXISTS `note_posts_history`;
CREATE TABLE `note_posts_history`  (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志id',
  `id` int(11) NULL DEFAULT NULL COMMENT '文章id',
  `created` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `type` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章类型',
  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '文章内容',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章标题',
  `status` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章状态',
  `category` int(11) NULL DEFAULT NULL COMMENT '分类id',
  `md5` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'md5校验',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
