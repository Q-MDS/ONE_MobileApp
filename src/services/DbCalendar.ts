import DbSetup from "./DbSetup";
import DbHelper from './DbHelper';

/**
 * CALENDAR/ACTIVITY TYPES
 * 1 - Work
 * 2 - Class
 * 3 - Sleep
 * 4 - Eating
 * 5 - Preperation
 * 6 - Commute
 * 7 - Allocate physical
 * 8 - Allocate emotional
 * 9 - Allocate mental
 * 10 - Allocate spiritual
 * 11 - Custom Physical
 * 12 - Custom Emotional	
 * 13 - Custom Mental
 * 14 - Custom Spiritual
 */
class DbCalendar 
{
    db = DbHelper.getDb();
    
	TABLE_CALENDAR: string = 'calendar';
	CREATE_TABLE_CALENDAR: string = DbSetup.CREATE_TABLE_CALENDAR;

    constructor() {}

	clearRecords = (activityType: number, saId: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM calendar WHERE activity_type = ? AND sa_id = ?',
					[activityType, saId],
					(tx: any, results: any) => 
					{
						resolve(results);
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	clearBreakfastRecords = (activityType: number, saId: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM calendar WHERE activity_type = ? AND sa_id = ? AND activity_desc = "Breakfast"	',
					[activityType, saId],
					(tx: any, results: any) => 
					{
						resolve(results);
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	clearLunchRecords = (activityType: number, saId: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM calendar WHERE activity_type = ? AND sa_id = ? AND activity_desc = "Lunch"	',
					[activityType, saId],
					(tx: any, results: any) => 
					{
						resolve(results);
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	clearDinnerRecords = (activityType: number, saId: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM calendar WHERE activity_type = ? AND sa_id = ? AND activity_desc = "Dinner"	',
					[activityType, saId],
					(tx: any, results: any) => 
					{
						resolve(results);
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	addRecord = (weekNum: number, dayNum: number, hourNum: number, activityType: number, activityTitle: string, activityDesc: string, saType: number, saId: number, reminder: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO calendar 
				(week_num, day_num, hour_num, activity_type, activity_title, activity_desc, sa_type, sa_id, reminder) 
			VALUES 
				(?,?,?,?,?,?,?,?,?)`;

			this.db.executeSql(sql, [weekNum, dayNum, hourNum, activityType, activityTitle, activityDesc, saType, saId, reminder], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	updActivityDesc = (activityType: number, saId: number, activityDec: string) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE calendar SET activity_desc = ? WHERE activity_type = ? AND sa_id = ?`, [activityDec, activityType, saId], (tx: any, results: any) => 
				{
					if (results.rowsAffected > 0) 
					{
						resolve(results.rowsAffected);
					} 
					else 
					{
						reject(new Error('Update operation failed'));
					}
				},
				(error: any) => 
				{
					reject(error);
				},
				);
			});
		});
	}

	updAllAllocateReminder	= (reminder: number) => 
	{
		return new Promise((resolve, reject) => 
			{
				this.db.transaction((tx: any) => 
				{
					tx.executeSql(`UPDATE calendar SET reminder = ? WHERE activity_type > 6`, [reminder], (tx: any, results: any) => 
					{
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('Update operation failed'));
						}
					},
					(error: any) => 
					{
						reject(error);
					},
					);
				});
			});
	}

	getCalendarRecords = (dayNum:number) => 
	{
		return new Promise((resolve, reject) => 
			{
				this.db.executeSql(`SELECT * FROM ${this.TABLE_CALENDAR} WHERE day_num = ? ORDER BY hour_num ASC`, [dayNum], (result: any) => 
				{
					let records = [];
	
					for (let i = 0; i < result.rows.length; i++) 
					{
						records.push(result.rows.item(i));
					}
					resolve(records);
				}, 
				(error: any) => 
				{
					reject(error);
				});
			});
	}


	// Truncate table
	truncCalendar = async () => 
    {
        await this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_CALENDAR);
        await this.db.executeSql(this.CREATE_TABLE_CALENDAR);
    }

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    chkTable = (activityType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT * FROM calendar_master WHERE activity_type = ?';

            this.db.executeSql(sql, [activityType], (result: any) => 
            {
                // console.log('Calendar: Check table > Get Records result: ', result);
                resolve(result);
            }, 
            (error: any) => 
            {
                // console.log('Calendar: Check table > Error: ', error);
                reject(error);
            });
        });
    }

    addSchedule = (weekNum: number, dayNumber: number, activityActive: number, activityType: number, activityTypeName: string, activityTitle: string, activityDesc: string, activityDate: string, activityTime: string, activityStart: number, activityEnd: number, activityDuration: number, show: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = `INSERT INTO calendar_master 
                (week_num, day_number, activity_active, activity_type, activity_type_name, activity_title, activity_desc, activity_date, activity_time, activity_start, activity_end, activity_duration, show) 
            VALUES 
                (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            this.db.executeSql(sql, [weekNum, dayNumber, activityActive, activityType, activityTypeName, activityTitle, activityDesc, activityDate, activityTime, activityStart, activityEnd, activityDuration, show], (result: any) => 
            {
                resolve(true);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    updActive = (recId: number, isChecked: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET activity_active = ? WHERE id = ?',
                [isChecked, recId],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    updPrepActive = (dayNumber: number, isChecked: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET activity_active = ? WHERE activity_type = "5" AND day_number = ?',
                [isChecked, dayNumber],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    updCommuteActive = (dayNumber: number, isChecked: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET active = ? WHERE activity_type = "6" AND day_number = ?',
                [isChecked, dayNumber],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    updTimes = (recId: number, startTime: number, endTime: number) => 
    {
        console.log('Update times: ', recId, startTime, endTime);
        let duration = endTime - startTime;
        if (startTime > endTime)
        {
            let x = 86400 - startTime;
            duration = endTime + x
        }

        // Get actual start time
        const hours = Math.floor(startTime / 3600);
        const minutes = Math.floor((startTime % 3600) / 60);
        const activity_time = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET activity_time = ?, activity_start = ?, activity_end = ?, activity_duration = ? WHERE id = ?',
                [activity_time, startTime, endTime, duration, recId],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    getNextPrepAddId(daynumber: number)
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT id FROM calendar_master WHERE activity_type = 5 AND day_number = ? AND show = 0 ORDER BY id ASC LIMIT 1';

            this.db.executeSql(sql, [daynumber], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    getNextCommuteAddId(daynumber: number)
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT id FROM calendar_master WHERE activity_type = 6 AND day_number = ? AND show = 0 ORDER BY id ASC LIMIT 1';

            this.db.executeSql(sql, [daynumber], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    addTime = (recId: number) => 
    {
        // Set flag to 1
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET show = 1, activity_duration = 0 WHERE id = ?',
                [recId],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    delTime = (recId: number) => 
    {
        // Set flag to 0
        // Set st, et & duration to 0
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET show = 0, activity_start = 0, activity_end = 0, activity_duration = 0 WHERE id = ?',
                [recId],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    /** Allocate PEMS */
    getAllocate = (allocateType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT * FROM calendar_master WHERE activity_type = ?';

            this.db.executeSql(sql, [allocateType], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    addAllocate = (weekNum: number, dayNumber: number, activityActive: number, activityType: number, activityTypeName: string, activityTitle: string, activityDesc: string, activityDate: string, activityTime: string, activityStart: number, activityEnd: number, activityDuration: number, show: number, otherNote: string) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = `INSERT INTO calendar_master 
                (week_num, day_number, activity_active, activity_type, activity_type_name, activity_title, activity_desc, activity_date, activity_time, activity_start, activity_end, activity_duration, show, other_note) 
            VALUES 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            this.db.executeSql(sql, [weekNum, dayNumber, activityActive, activityType, activityTypeName, activityTitle, activityDesc, activityDate, activityTime, activityStart, activityEnd, activityDuration, show, otherNote], (result: any) => 
            {
                resolve(true);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    getScheduleDuration = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT SUM(activity_duration) as total_duration FROM calendar_master WHERE activity_type < 7 AND activity_active = 1;';

            this.db.executeSql(sql, [], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    getAllocatedDuration = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT SUM(activity_duration) as total_allocated FROM calendar_master WHERE activity_type > 6 AND activity_type < 11;';

            this.db.executeSql(sql, [], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    updAllocateHours = (totSeconds: number, allocateType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET activity_active = 1, show = 1, activity_duration = ? WHERE activity_type = ?',
                [totSeconds, allocateType],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    updAllocateActivities = (activities: string, allocateType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET activity_desc = ? WHERE activity_type = ?',
                [activities, allocateType],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    updAllocateOther = (otherNote: string, allocateType: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE calendar_master SET other_note = ? WHERE activity_type = ?',
                [otherNote, allocateType],
                (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error: any) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    getOnePlanType = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = 'SELECT one_package FROM profile;';

            this.db.executeSql(sql, [], (result: any) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

	copyCalendar = (weekNum: number) => 
	{
		return new Promise((resolve, reject) => 
			{
				this.db.transaction((tx: any) => 
				{
					tx.executeSql(
					'UPDATE calendar SET week_num = ?',
					[weekNum],
					(tx: any, results: any) => 
					{
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('Update operation failed'));
						}
					},
					(error: any) => 
					{
						reject(error);
					},
					);
				});
			});
	}

    
}

export default new DbCalendar();