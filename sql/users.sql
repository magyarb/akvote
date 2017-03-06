/*
Navicat PGSQL Data Transfer

Source Server         : postgres2
Source Server Version : 90601
Source Host           : localhost:5432
Source Database       : postgres
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90601
File Encoding         : 65001

Date: 2017-03-06 18:10:15
*/


-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
"fbid" varchar(255) COLLATE "default" NOT NULL,
"fbtoken" varchar(255) COLLATE "default",
"email" varchar(255) COLLATE "default",
"name" varchar(255) COLLATE "default",
"picurl" varchar(255) COLLATE "default",
"isak" bool,
"ishok" bool,
"votedfor" varchar(255) COLLATE "default",
"applicationpdf" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD PRIMARY KEY ("fbid");
