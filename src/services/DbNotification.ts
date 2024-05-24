import DbSetup from "./DbSetup";
import DbHelper from './DbHelper';

class DbNotification 
{
    db = DbHelper.getDb();
    TABLE_NOTIFICATION: string = 'notifications';
	CREATE_TABLE_NOTIFICATIONS: string = DbSetup.CREATE_TABLE_NOTIFICATIONS;
	
	// Notitypes are: 1 - Diary (activities), 2 - Reminder (Plan next), 3 - Verify, 4 - Accountability, 5 - Pop up
	// Noti due will be the time for that day 00:00 or timestamp/integer value
	// Active will be 1 when created and if it is past due time then it will be set to 0
	// Was done will be 1 if the user clicked on it

    constructor() {}

    getRecords = (dayNum) => 
    {
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM notifications WHERE day_num = ? ORDER BY noti_due DESC';

			this.db.executeSql(sql, [dayNum], (result) => 
			{
				resolve(result);
			}, 
			(error) => 
			{
				reject(error);
			});
		});
    }
	
    addRecord = (createDate: number, weekNum: number, dayNum: number, notiType: number, notiTitle: string, notiDesc: string, notiDue: number, active: number, wasDone: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = `INSERT INTO notifications 
                (create_date, week_num, day_num, noti_type, noti_title, noti_desc, noti_due, active, was_done) 
            VALUES 
                (?,?,?,?,?,?,?,?,?)`;

            this.db.executeSql(sql, [createDate, weekNum, dayNum, notiType, notiTitle, notiDesc, notiDue, active, wasDone], (result) => 
            {
                resolve(result.insertId);
            }, 
            (error) => 
            {
                reject(error);
            });
        });
    }

    updRecord = () => 
    {

    }

    // Testing only
    truncTable = () => 
    {
        this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_NOTIFICATION);
        this.db.executeSql(this.CREATE_TABLE_NOTIFICATIONS);

        return "Ok";
    }

}
export default new DbNotification();