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

            db.executeSql(sql, [], (result) => 
            {
                console.log('Get profile result: ', result.rows.item(0));
                resolve(result.rows.item(0));
            }, 
            (error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE settings SET expire_warn_counter = ?, notifications = ?, quotes = ?, quiz_mode = ?, plan_type = ?',
                [expireWarnCounter, notifications, quotes, quizMode, planType],
                (tx, results) => 
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
                (error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).notifications);
			}, 
			(error) => 
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
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET notifications = ?', [notifications], (tx, results) => 
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
				(error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).plan_type);
			}, 
			(error) => 
			{
				reject(error);
			});
		});
	}

	setPlanType = (planType) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET planType = ?', [planType], (tx, results) => 
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
				(error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).quotes);
			}, 
			(error) => 
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
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET quotes = ?', [quotes], (tx, results) => 
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
				(error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).quiz_mode);
			}, 
			(error) => 
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
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET quiz_mode = ?', [quizMode], (tx, results) => 
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
				(error) => 
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
		let sql = 'SELECT start_day FROM settings WHERE id = 1';

		return new Promise((resolve, reject) => 
		{
			db.executeSql(sql, [], (result) => 
			{
				startDay = Number(result.rows.item(0).start_day);
				resolve(startDay);
			}, 
			(error) => 
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
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET start_day = ?', [startDay], (tx, results) => 
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
				(error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE settings SET week_num = ?', [weekNumber], (tx, results) => 
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
                (error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				weekNum = Number(result.rows.item(0).week_num);
				resolve(weekNum);
			}, 
			(error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE settings SET day_num = ?', [dayNumber], (tx, results) => 
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
                (error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).day_num);
			}, 
			(error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).activity_reminders);
			}, 
			(error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE settings SET activity_reminders = ?', [activityReminders], (tx, results) => 
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
                (error) => 
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
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET diary_mode = ?', [diaryMode], (tx, results) => 
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
				(error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).diary_mode);
			}, 
			(error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE settings SET notifications = ?, quotes = ?, quiz_mode = ?,  plan_type = ?, analytics =?', [0, 0, 0, 0, 0], (tx, results) => 
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
                (error) => 
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
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE settings SET notifications = ?, quotes = ?, quiz_mode = ?,  plan_type = ?, analytics =?', [1, 1, 1, 1, 1], (tx, results) => 
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
                (error) => 
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
			db.executeSql(sql, [], (result) => 
			{
				resolve(result.rows.item(0).subscribed);
			}, 
			(error) => 
			{
				reject(error);
			});
		});
	}

	setSubscribed = (subscribed) => 
	{
		let db = DbHelper.getDb();

		return new Promise((resolve, reject) => 
		{
			db.transaction((tx) => 
			{
				tx.executeSql('UPDATE settings SET subscribed = ?', [subscribed], (tx, results) => 
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
				(error) => 
				{
					reject(error);
				},
				);
			});
		});
	}
}
export default new DBSettings();