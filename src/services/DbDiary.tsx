import DbHelper from './DbHelper';

class DbDiary 
{
    db = DbHelper.getDb();

    constructor() {}

    getRecords = (dayNumber:number, activityType: number, showType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT id, day_number, activity_active, activity_type, activity_title, activity_desc, activity_time, activity_start, activity_end, activity_duration, show, other_note FROM calendar_master WHERE day_number = ? AND activity_active = ? AND show = ? ORDER BY activity_time ASC';

            this.db.executeSql(sql, [dayNumber, activityType, showType], (result) => 
            {
                resolve(result);
            }, 
            (error) => 
            {
                reject(error);
            });
        });
    }

	getWeekNum = () => 
		{
			return new Promise((resolve, reject) => 
			{
				let sql = 'SELECT week_num, day_number FROM calendar_master LIMIT 1';
	
				this.db.executeSql(sql, [], (result) => 
				{
					resolve(result);
				}, 
				(error) => 
				{
					reject(error);
				});
			});
		}

}

export default new DbDiary;