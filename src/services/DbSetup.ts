import SQLite from 'react-native-sqlite-storage';
import DbHelper from './DbHelper';

class DbSetup 
{
    //db: SQLite.SQLiteDatabase | null = null;
	db: any = SQLite.SQLiteDatabase;

    dbInit: number = 1; // 0 = created, 1 = upgrade

	TABLE_ACCOUNTABILITY_DETAIL: string = 'accountability_detail';
	TABLE_ACCOUNTABILITY_MASTER: string = 'accountability_master';
	TABLE_CALENDAR: string = 'calendar';
	TABLE_LIST_QUIZ: string = 'list_quiz';
	TABLE_NOTIFICATION: string = 'notifications';
	TABLE_PROFILE: string = 'profile';
	TABLE_QUIZ_CONTROL: string = 'quiz_control';
	TABLE_SETTINGS: string = 'settings';
	TABLE_UPLOAD_QUEUE: string = 'upload_queue';
	TABLE_VERIFY_DETAIL: string = 'verify_detail';
	TABLE_VERIFY_MASTER: string = 'verify_master';
	// New
	TABLE_SCHEDULE_WORK: string = 'schedule_work';
	TABLE_SCHEDULE_CLASS: string = 'schedule_class';
	TABLE_SCHEDULE_SLEEP: string = 'schedule_sleep';
	TABLE_SCHEDULE_EAT: string = 'schedule_eat';
	TABLE_SCHEDULE_PREPARE: string = 'schedule_prepare';
	TABLE_SCHEDULE_COMMUTE: string = 'schedule_commute';
	TABLE_ALLOCATE_PHYSICAL: string = 'allocate_physical';
	TABLE_ALLOCATE_EMOTIONAL: string = 'allocate_emotional';
	TABLE_ALLOCATE_MENTAL: string = 'allocate_mental';
	TABLE_ALLOCATE_SPIRITUAL: string = 'allocate_spiritual';

	// Delete later
    TABLE_CALENDAR_MASTER: string = 'calendar_master';
	

    CREATE_TABLE_PROFILE: string = `CREATE TABLE "main"."` + this.TABLE_PROFILE + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "remote_id"  INTEGER,
        "first_time_use"  INTEGER DEFAULT 0,
        "first_time_login"  INTEGER DEFAULT 0,
        "first_name"  TEXT,
        "last_name"  TEXT,
        "cred_1"  TEXT,
        "token"  TEXT,
        "plan_type"  INTEGER DEFAULT 0,
        "card_info_save"  INTEGER,
        "card_info_data"  TEXT
	);`;
    CREATE_TABLE_CALENDAR_MASTER: string = `CREATE TABLE "main"."` + this.TABLE_CALENDAR_MASTER + `" (
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
	);`;
    CREATE_TABLE_LIST_QUIZ: string = `CREATE TABLE "main"."` + this.TABLE_LIST_QUIZ + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "question"  TEXT,
        "answer_one"  TEXT,
        "answer_two"  TEXT
        )
	;`;
    CREATE_TABLE_UPLOAD_QUEUE: string = `CREATE TABLE "main"."` + this.TABLE_UPLOAD_QUEUE + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "apk_id"  INTEGER,
        "upload_type"  INTEGER,
        "upload_data"  TEXT,
        "upload_done"  INTEGER DEFAULT 0
        )
	;`;
	CREATE_TABLE_NOTIFICATIONS: string = `CREATE TABLE "main"."` + this.TABLE_NOTIFICATION + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"create_date"  INTEGER,
		"week_num"  INTEGER DEFAULT 0,
		"day_num"  INTEGER DEFAULT 0,
		"noti_type"  INTEGER DEFAULT 0,
		"noti_title"  TEXT,
		"noti_desc"  TEXT,
		"noti_due"  INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 1,
		"was_done" INTEGER DEFAULT 0
		)
	;`;
    CREATE_TABLE_QUIZ_CONTROL: string = `CREATE TABLE "main"."` + this.TABLE_QUIZ_CONTROL + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "week_number" NUMBER DEFAULT 0,
        "day_array" TEXT,
        "done" INTEGER DEFAULT 0
        )
	;`;
    CREATE_TABLE_SETTINGS: string = `CREATE TABLE "main"."` + this.TABLE_SETTINGS + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "expire_warn_counter" INTEGER DEFAULT 0,
        "notifications" INTEGER DEFAULT 0,
        "quotes" INTEGER DEFAULT 0,
        "quiz_mode" INTEGER DEFAULT 0,
        "plan_type" INTEGER DEFAULT 1,
        "start_day" INTEGER DEFAULT 0,
        "week_num" INTEGER DEFAULT 0,
        "day_num" INTEGER DEFAULT 0,
		"diary_mode" INTEGER DEFAULT 0,
		"analytics" INTEGER DEFAULT 0,
		"activity_reminders" INTEGER DEFAULT 0,
		"subscribed" INTEGER DEFAULT 0,
		"sa_mode" INTEGER DEFAULT 0
        )
	;`;
	CREATE_TABLE_VERIFY_MASTER: string = `CREATE TABLE "main"."` + this.TABLE_VERIFY_MASTER + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "noti_id" INTEGER,
        "noti_accept" INTEGER DEFAULT 0,
		"vm_date" INTEGER DEFAULT 0,
        "vm_time" INTEGER DEFAULT 0,
        "vm_year" INTEGER DEFAULT 0,
        "week_num" INTEGER DEFAULT 0,
        "day_num" INTEGER DEFAULT 0,
        "vm_tot_score" INTEGER DEFAULT 0,
        "vm_status" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_VERIFY_DETAIL: string = `CREATE TABLE "main"."` + this.TABLE_VERIFY_DETAIL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"vm_id" INTEGER,
		"vd_type" TEXT,
		"vd_type_desc" TEXT,
		"vd_tot_seconds" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ACCOUNTABILITY_MASTER: string = `CREATE TABLE "main"."` + this.TABLE_ACCOUNTABILITY_MASTER + `" (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"noti_id" INTEGER,
		"noti_accept" INTEGER DEFAULT 0,
		"am_date" INTEGER DEFAULT 0,
		"am_time" INTEGER DEFAULT 0,
		"am_year" INTEGER DEFAULT 0,
		"week_num" INTEGER DEFAULT 0,
		"day_num" INTEGER DEFAULT 0,
		"am_tot_score" INTEGER DEFAULT 0,
		"am_status" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ACCOUNTABILITY_DETAIL: string = `CREATE TABLE "main"."` + this.TABLE_ACCOUNTABILITY_DETAIL + `" (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"am_id" INTEGER,
		"ad_date" INTEGER DEFAULT 0,
		"ad_time" INTEGER DEFAULT 0,
		"ad_type" TEXT,
		"ad_type_desc" TEXT,
		"ad_expected" TEXT,
		"ad_got" TEXT,
		"ad_match" INTEGER DEFAULT 0
	);`;

	// New
	CREATE_TABLE_CALENDAR: string = `CREATE TABLE "main"."` + this.TABLE_CALENDAR + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"week_num" INTEGER DEFAULT 0,
		"day_num" INTEGER DEFAULT 0,
		"hour_num" INTEGER DEFAULT 0,
		"activity_type" INTEGER DEFAULT 0,
		"activity_title" TEXT,
		"activity_desc" TEXT,
		"sa_type" INTEGER DEFAULT 0,
		"sa_id" INTEGER DEFAULT 0,
		"reminder" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_WORK: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_WORK + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 0,
		"start_time" INTEGER DEFAULT 0,
		"end_time" INTEGER DEFAULT 0,
		"roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_CLASS: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_CLASS + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 0,
		"start_time" INTEGER DEFAULT 0,
		"end_time" INTEGER DEFAULT 0,
		"roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_SLEEP: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_SLEEP + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 0,
		"start_time" INTEGER DEFAULT 0,
		"end_time" INTEGER DEFAULT 0,
		"roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_EAT: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_EAT + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"breakfast_active" INTEGER DEFAULT 0,
		"breakfast_start" INTEGER DEFAULT 0,
		"breakfast_end" INTEGER DEFAULT 0,
		"breakfast_roll_over" INTEGER DEFAULT 0,
		"lunch_active" INTEGER DEFAULT 0,
		"lunch_start" INTEGER DEFAULT 0,
		"lunch_end" INTEGER DEFAULT 0,
		"lunch_roll_over" INTEGER DEFAULT 0,
		"dinner_active" INTEGER DEFAULT 0,
		"dinner_start" INTEGER DEFAULT 0,
		"dinner_end" INTEGER DEFAULT 0,
		"dinner_roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_PREPARE: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_PREPARE + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 0,
		"start_time" INTEGER DEFAULT 0,
		"end_time" INTEGER DEFAULT 0,
		"roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_SCHEDULE_COMMUTE: string = `CREATE TABLE "main"."` + this.TABLE_SCHEDULE_COMMUTE + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"day_num" INTEGER DEFAULT 0,
		"active" INTEGER DEFAULT 0,
		"start_time" INTEGER DEFAULT 0,
		"end_time" INTEGER DEFAULT 0,
		"roll_over" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ALLOCATE_PHYSICAL: string = `CREATE TABLE "main"."` + this.TABLE_ALLOCATE_PHYSICAL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"activity" TEXT,
		"activity_note" TEXT,
		"tot_hours" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ALLOCATE_EMOTIONAL: string = `CREATE TABLE "main"."` + this.TABLE_ALLOCATE_EMOTIONAL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"activity" TEXT,
		"activity_note" TEXT,
		"tot_hours" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ALLOCATE_MENTAL: string = `CREATE TABLE "main"."` + this.TABLE_ALLOCATE_MENTAL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"activity" TEXT,
		"activity_note" TEXT,
		"tot_hours" INTEGER DEFAULT 0
	);`;
	CREATE_TABLE_ALLOCATE_SPIRITUAL: string = `CREATE TABLE "main"."` + this.TABLE_ALLOCATE_SPIRITUAL + `" (
		"id"  INTEGER PRIMARY KEY AUTOINCREMENT,
		"activity" TEXT,
		"activity_note" TEXT,
		"tot_hours" INTEGER DEFAULT 0
	);`;

	/**
	 * SCHEDULE WORK TABLE
	 * id - day_num - day_name - active - start_time - end_time
	 * ALLOCATE_PHYSICAL TABLE
	 * id - activity-type (eg. cardio, workout) - activity_note - hours allocated (def 0) as changes CD get updated
	 * - on recall if hours_allocated is > 0 then checked
	 */

    constructor() 
    {
    }

    successCallback = () => 
    {
        console.log('Database connected!');
    };
    
    errorCallback = (error: any) => 
    {
        console.log('Database error', error);
    };

    dbCheck = () => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = "SELECT name FROM sqlite_master WHERE type='table'";

            db.executeSql(sql, [], (result: any) => 
            {
                console.log('DBCheck result: ', result.rows.length);

                if (result.rows.length === 1) 
                {
                    this.onUpgrade(db);
                    this.onCreate(db);
                }
                else 
                {
                    // console.log('Dont stress the tables are there');
                }

                resolve(result);
            }, 
            (error: any) => 
            {
                console.log('DbCheck error: ', error);
                reject(error);
            });

        });
    }

    onCreate = (db: any) => 
    {
        // let db = DbHelper.getDb();
        if (!db) 
        {
          console.error('Database connection is not established.');
          return;
        }

        try 
        {
            db.executeSql(this.CREATE_TABLE_PROFILE);
            db.executeSql(this.CREATE_TABLE_CALENDAR_MASTER);
            db.executeSql(this.CREATE_TABLE_LIST_QUIZ);
            db.executeSql(this.CREATE_TABLE_UPLOAD_QUEUE);
            db.executeSql(this.CREATE_TABLE_NOTIFICATIONS);
            db.executeSql(this.CREATE_TABLE_QUIZ_CONTROL);
            db.executeSql(this.CREATE_TABLE_SETTINGS);
            db.executeSql(this.CREATE_TABLE_VERIFY_MASTER);
            db.executeSql(this.CREATE_TABLE_VERIFY_DETAIL);
            db.executeSql(this.CREATE_TABLE_ACCOUNTABILITY_MASTER);
            db.executeSql(this.CREATE_TABLE_ACCOUNTABILITY_DETAIL);
            db.executeSql(this.CREATE_TABLE_CALENDAR);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_WORK);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_CLASS);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_SLEEP);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_EAT);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_PREPARE);
            db.executeSql(this.CREATE_TABLE_SCHEDULE_COMMUTE);
            db.executeSql(this.CREATE_TABLE_ALLOCATE_PHYSICAL);
            db.executeSql(this.CREATE_TABLE_ALLOCATE_EMOTIONAL);
            db.executeSql(this.CREATE_TABLE_ALLOCATE_MENTAL);
            db.executeSql(this.CREATE_TABLE_ALLOCATE_SPIRITUAL);
        } 
        catch (error) 
        {
          console.error("Error creating tables: ", error);
        }
    }

    onUpgrade = (db: any) => 
    {
        if (!db) 
        {
          console.error('Database connection is not established.');
          return;
        }
      
        try 
        {
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_PROFILE);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_CALENDAR_MASTER);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_LIST_QUIZ);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_UPLOAD_QUEUE);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_NOTIFICATION);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_QUIZ_CONTROL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SETTINGS);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_VERIFY_MASTER);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_VERIFY_DETAIL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ACCOUNTABILITY_MASTER);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ACCOUNTABILITY_DETAIL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_CALENDAR);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_WORK);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_CLASS);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_SLEEP);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_EAT);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_PREPARE);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_COMMUTE);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_PHYSICAL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_EMOTIONAL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_MENTAL);
			db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_SPIRITUAL);
        } 
        catch (error) 
        {
          console.error("Error upgrading database:", error);
        }
    };

    truncProfile = (db: any) => 
    {
        if (!db) 
        {
          console.error('Database connection is not established.');
          return;
        }
      
        try 
        {
            db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_PROFILE);
            db.executeSql(this.CREATE_TABLE_PROFILE);
        } 
        catch (error) 
        {
            console.error("Error upgrading database:", error);
        }
    }

    dbReset = () => 
    {
        console.log('DB Reset called');
        let db = DbHelper.getDb();

        this.onUpgrade(db);
        this.onCreate(db);

        // Add default settings
        this.addSettings(db);

        // Add default records to pop_log
        this.addQuizControlRecs(db);
    }

    signUpReset = () => 
    {
        let db = DbHelper.getDb();
    }

    addSettings = (db: any) => 
    {
        if (!db) 
        {
          console.error('Database connection is not established.');
          return;
        }
      
        try 
        {
            let sql = "INSERT INTO " + this.TABLE_SETTINGS + " (expire_warn_counter, notifications, quotes, quiz_mode, plan_type) VALUES (?, ?, ?, ?, ?)";
            db.executeSql(sql, [0, 0, 0, 0, 1]);
        } 
        catch (error) 
        {
            console.error("Error adding quiz control records:", error);
        }
    }

    addQuizControlRecs = (db: any) => 
    {
        if (!db) 
        {
          console.error('Database connection is not established.');
          return;
        }
      
        try 
        {
            // Need to get current week number, then add 1 in a for loop and add records for each week
            let currentWeek: number = this.getCurrentWeekNumber();
            const getDayArray = new Array(7).fill(0);
            const dayArray = JSON.stringify(getDayArray);

            for (let i = 0; i < 5; i++)
            {
                let sql = "INSERT INTO " + this.TABLE_QUIZ_CONTROL + " (week_number, day_array, done) VALUES (?, ?, ?)";
                db.executeSql(sql, [currentWeek, dayArray, 0]);
                currentWeek++;
            }
        } 
        catch (error) 
        {
            console.error("Error adding quiz control records:", error);
        }
    }

    getCurrentWeekNumber() 
    {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const firstThursday = start.getDay() < 4 ? start : new Date(start.setDate(start.getDate() + (7 - start.getDay() + 4) % 7));
        const diffInMilliseconds = now.getTime() - firstThursday.getTime();
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        
        return Math.floor(diffInMilliseconds / oneWeekInMilliseconds) + 1;
    }

    closeDb = () => 
    {
        if (this.db) 
        {
          this.db.close(() => console.log('Database closed.'));
        } 
        else 
        {
          console.log('Database was not OPENED');
        }
    };
}   

export default new DbSetup();