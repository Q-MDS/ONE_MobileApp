import DbSetup from "./DbSetup";
import DbHelper from './DbHelper';

class DBSettings
{
    db = DbHelper.getDb();

    TABLE_SETTINGS: string = 'settings';
    CREATE_TABLE_NOTIFICATIONS: string = DbSetup.CREATE_TABLE_SETTINGS;

    constructor() {}

    getSettings = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT * FROM settings WHERE id = 1';

            db.executeSql(sql, [], (result: any) => 
            {
                console.log('Get profile result: ', result.rows.item(0));
                resolve(result.rows.item(0));
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    updSettings = (expireWarnCounter: number, notifications: number, quotes: number, quizMode: number, planType: number) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql(
                'UPDATE settings SET expire_warn_counter = ?, notifications = ?, quotes = ?, quiz_mode = ?, plan_type = ?',
                [expireWarnCounter, notifications, quotes, quizMode, planType],
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
	
	getNotifications = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT notifications FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).notifications);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setNotifications = (notifications: number) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET notifications = ?', [notifications], (tx: any, results: any) => 
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

	getPlanType = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT plan_type FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).plan_type);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setPlanType = (planType: any) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET planType = ?', [planType], (tx: any, results: any) => 
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

	getQuotes = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT quotes FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).quotes);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setQuotes = (quotes: number) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET quotes = ?', [quotes], (tx: any, results: any) => 
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

	getQuizMode	= () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT quiz_mode FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).quiz_mode);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setQuizMode = (quizMode: number) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET quiz_mode = ?', [quizMode], (tx: any, results: any) => 
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

	getStartDay	= () => 
	{
		let startDay = 0
		let db = DbHelper.getDb();
		let sql = 'SELECT day_num FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				startDay = Number(result.rows.item(0).day_num);
				resolve(startDay);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setStartDay = (startDay: number) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET start_day = ?, day_num = ?', [startDay, startDay], (tx: any, results: any) => 
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

	setWeekNumber = (weekNumber: number) => 
	{
		let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql('UPDATE settings SET week_num = ?', [weekNumber], (tx: any, results: any) => 
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

	getWeekNumber = () => 
	{
		let weekNum = 0;
		let db = DbHelper.getDb();
		let sql = 'SELECT week_num FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				weekNum = Number(result.rows.item(0).week_num);
				resolve(weekNum);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setDayNumber = (dayNumber: number) => 
	{
		let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql('UPDATE settings SET day_num = ?', [dayNumber], (tx: any, results: any) => 
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

	getDayNumber = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT day_num FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).day_num);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getActivtyReminders = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT activity_reminders FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).activity_reminders);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setActivtyReminders = (activityReminders: number) => 
	{
		let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql('UPDATE settings SET activity_reminders = ?', [activityReminders], (tx: any, results: any) => 
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

	setDiaryMode = (diaryMode: number) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET diary_mode = ?', [diaryMode], (tx: any, results: any) => 
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

	getDiaryMode = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT diary_mode FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).diary_mode);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setFreePlan = () => 
	{
		let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql('UPDATE settings SET notifications = ?, quotes = ?, quiz_mode = ?,  plan_type = ?, analytics =?', [0, 0, 0, 0, 0], (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed 2'));
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

	setCoachingPlan = () => 
	{
		let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx: any) => 
            {
                tx.executeSql('UPDATE settings SET notifications = ?, quotes = ?, quiz_mode = ?,  plan_type = ?, analytics =?', [1, 1, 1, 1, 1], (tx: any, results: any) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed 3'));
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

	getSubscribed = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT subscribed FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).subscribed);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setSubscribed = (subscribed: any) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET subscribed = ?', [subscribed], (tx: any, results: any) => 
				{
					if (results.rowsAffected > 0) 
					{
						resolve(results.rowsAffected);
					} 
					else 
					{
						reject(new Error('Update operation failed 1'));
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

	getSAMode = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT sa_mode FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).sa_mode);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setSAMode = (saMode: any) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET sa_mode = ?', [saMode], (tx: any, results: any) => 
				{
					if (results.rowsAffected > 0) 
					{
						resolve(results.rowsAffected);
					} 
					else 
					{
						reject(new Error('Update operation failed 1'));
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

	getReminders = () => 
	{
		let db = DbHelper.getDb();
		let sql = 'SELECT reminders FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result: any) => 
			{
				resolve(result.rows.item(0).reminders);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}		

	setReminders = (reminders: string) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE settings SET reminders = ?', [reminders], (tx: any, results: any) => 
				{
					if (results.rowsAffected > 0) 
					{
						resolve(results.rowsAffected);
					} 
					else 
					{
						reject(new Error('Update operation failed 1'));
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

export default new DBSettings();