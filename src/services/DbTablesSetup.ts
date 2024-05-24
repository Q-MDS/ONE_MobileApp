// DbTablesSetup.ts
const TABLENAME_PROFILE = 'profile';
const TABLENAME_CALENDAR_MASTER = 'calendar_master';
const TABLENAME_SETTINGS = 'settings';
const TABLENAME_NOTIFICATION = 'notifications';
const TABLENAME_LIST_QUIZ = 'list_quiz';
const TABLENAME_QUIZ_CONTROL = 'quiz_control';
const TABLENAME_VERIFY_MASTER = 'verify_master';
const TABLENAME_VERIFY_DETAIL = 'verify_detail';
const TABLENAME_ACCOUNTABILITY_MASTER = 'accountability_master';
const TABLENAME_ACCOUNTABILITY_DETAIL = 'accountability_detail';

export const DbTableNames = 
{
	TABLENAME_PROFILE: TABLENAME_PROFILE,
	TABLENAME_CALENDAR_MASTER: TABLENAME_CALENDAR_MASTER,
	TABLENAME_SETTINGS: TABLENAME_SETTINGS,
	TABLENAME_NOTIFICATION: TABLENAME_NOTIFICATION,
	TABLENAME_LIST_QUIZ: TABLENAME_LIST_QUIZ,
	TABLENAME_QUIZ_CONTROL: TABLENAME_QUIZ_CONTROL,
	TABLENAME_VERIFY_MASTER: TABLENAME_VERIFY_MASTER,
	TABLENAME_VERIFY_DETAIL: TABLENAME_VERIFY_DETAIL,
	TABLENAME_ACCOUNTABILITY_MASTER: TABLENAME_ACCOUNTABILITY_MASTER,
	TABLENAME_ACCOUNTABILITY_DETAIL: TABLENAME_ACCOUNTABILITY_DETAIL
};

export const DbTablesSetup = 
{
	TABLE_PROFILE: `CREATE TABLE "main"."` + TABLENAME_PROFILE + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "remote_id"  INTEGER,
        "first_time_use"  INTEGER DEFAULT 0,
        "first_time_login"  INTEGER DEFAULT 0,
        "first_name"  TEXT,
        "last_name"  TEXT,
        "cred_1"  TEXT,
        "cred_2"  TEXT,
        "token"  TEXT,
        "notifications"  INTEGER DEFAULT 0,
        "quotes"  INTEGER DEFAULT 0,
        "quiz_mode"  INTEGER DEFAULT 0,
        "remember_me"  INTEGER DEFAULT 0,
        "accept_tc"  INTEGER DEFAULT 0,
        "one_package"  INTEGER DEFAULT 0,
        "subscription_type"  INTEGER DEFAULT 0,
        "card_info_save"  INTEGER,
        "card_info_data"  TEXT
	);`,
	TABLE_CALENDAR_MASTER: `CREATE TABLE "main"."` + TABLENAME_CALENDAR_MASTER + `" (
	"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
	"week_num"  INTEGER DEFAULT 0,
	"day_number"  INTEGER DEFAULT 0,
	"activity_active"  INTEGER,
	"activity_type"  INTEGER DEFAULT 0,
	"activity_type_name"  TEXT,
	"activity_title"  TEXT,
	"activity_desc"  TEXT,
	"activity_date"  TEXT,
	"activity_time"  TEXT,
	"activity_start"  INTEGER DEFAULT 0,
	"activity_end"  INTEGER DEFAULT 0,
	"activity_duration"  INTEGER DEFAULT 0,
	"show"  INTEGER DEFAULT 0,
	"other_note"  TEXT
	);`,
	TABLE_SETTINGS: `CREATE TABLE "main"."` + TABLENAME_SETTINGS + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "expire_warn_counter" INTEGER DEFAULT 0,
        "notifications" INTEGER DEFAULT 0,
        "quotes" INTEGER DEFAULT 0,
        "quiz_mode" INTEGER DEFAULT 0,
        "plan_type" INTEGER DEFAULT 1,
        "start_day" INTEGER DEFAULT 0,
        "week_num" INTEGER DEFAULT 0,
        "day_num" INTEGER DEFAULT 0
        )
	;`,
	TABLE_NOTIFICATIONS: `CREATE TABLE "main"."` + TABLENAME_NOTIFICATION + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "title" TEXT,
        "message" TEXT,
        "send_date" INTEGER DEFAULT 0,
        "repeat_type" TEXT,
        "active" INTEGER DEFAULT 0
        )
	;`,
	TABLE_LIST_QUIZ: `CREATE TABLE "main"."` + TABLENAME_LIST_QUIZ + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "question"  TEXT,
        "answer_one"  TEXT,
        "answer_two"  TEXT
        )
	;`,
	TABLE_QUIZ_CONTROL: `CREATE TABLE "main"."` + TABLENAME_QUIZ_CONTROL + `" (
	"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
	"week_number" NUMBER DEFAULT 0,
	"day_array" TEXT,
	"done" INTEGER DEFAULT 0
	)
	;`,
	TABLE_VERIFY_MASTER: `CREATE TABLE "main"."` + TABLENAME_VERIFY_MASTER + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "noti_id" INTEGER,
        "noti_accept" INTEGER DEFAULT 0,
		"vm_date" TEXT,
        "vm_time" TEXT,
        "vm_year" INTEGER,
        "week_num" INTEGER DEFAULT 0,
        "day_num" INTEGER DEFAULT 0,
        "vm_tot_score" INTEGER DEFAULT 0,
        "vm_status" INTEGER DEFAULT 0
	);`,
	TABLE_VERIFY_DETAIL: `CREATE TABLE "main"."` + TABLENAME_VERIFY_DETAIL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"vm_id" INTEGER,
		"vd_date" TEXT,
		"vd_time" TEXT,
		"vd_type" TEXT,
		"vd_type_desc" TEXT,
		"vd_tot_seconds" INTEGER DEFAULT 0,
		"vd_score" INTEGER DEFAULT 0
	);`,
	TABLE_ACCOUNTABILITY_MASTER: `CREATE TABLE "main"."` + TABLENAME_ACCOUNTABILITY_MASTER + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"noti_id" INTEGER,
		"noti_accept" INTEGER DEFAULT 0,
		"am_date" TEXT,
		"am_time" TEXT,
		"am_year" TEXT,
		"week_num" INTEGER DEFAULT 0,
		"day_num" INTEGER DEFAULT 0,
		"am_tot_score" INTEGER DEFAULT 0,
		"am_status" INTEGER DEFAULT 0
	);`,
	CREATE_TABLE_ACCOUNTABILITY_DETAIL: `CREATE TABLE "main"."` + TABLENAME_ACCOUNTABILITY_DETAIL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"am_id" INTEGER,
		"ad_date" TEXT,
		"ad_time" TEXT,
		"ad_expected" TEXT,
		"ad_got" TEXT,
		"ad_score" INTEGER DEFAULT 0
		);`,
};