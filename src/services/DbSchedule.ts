import DbSetup from './DbSetup';
import DbHelper from './DbHelper';

class DbSchedule 
{
    db = DbHelper.getDb();
    TABLE_SCHEDULE_WORK: string = 'schedule_work';
    TABLE_SCHEDULE_CLASS: string = 'schedule_class';
    TABLE_SCHEDULE_SLEEP: string = 'schedule_sleep';
    TABLE_SCHEDULE_EAT: string = 'schedule_eat';
    TABLE_SCHEDULE_PREPARE: string = 'schedule_prepare';
    TABLE_SCHEDULE_COMMUTE: string = 'schedule_commute';

	CREATE_TABLE_SCHEDULE_WORK: string = DbSetup.CREATE_TABLE_SCHEDULE_WORK;
	CREATE_TABLE_SCHEDULE_CLASS: string = DbSetup.CREATE_TABLE_SCHEDULE_CLASS;
	CREATE_TABLE_SCHEDULE_SLEEP: string = DbSetup.CREATE_TABLE_SCHEDULE_SLEEP;
	CREATE_TABLE_SCHEDULE_EAT: string = DbSetup.CREATE_TABLE_SCHEDULE_EAT;
	CREATE_TABLE_SCHEDULE_PREPARE: string = DbSetup.CREATE_TABLE_SCHEDULE_PREPARE;
	CREATE_TABLE_SCHEDULE_COMMUTE: string = DbSetup.CREATE_TABLE_SCHEDULE_COMMUTE;

    constructor() {}

	initWorkSchedule = (dayNum: number, active: number, startTime: number, endtime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_work 
				(day_num, active, start_time, end_time, roll_over) 
			VALUES 
				(?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, active, startTime, endtime, rollOver], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getWorkRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_work ORDER BY id ASC';

			this.db.executeSql(sql, [], (result: any)=> 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getWorkRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_work WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}		

	setWorkActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any): any => 
			{
				tx.executeSql('UPDATE schedule_work SET active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setWorkTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_work SET start_time = ?, end_time = ?, roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	initClassSchedule = (dayNum: number, active: number, startTime: number, endtime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_class 
				(day_num, active, start_time, end_time, roll_over) 
			VALUES 
				(?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, active, startTime, endtime, rollOver], (result: any)=> 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getClassRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_class ORDER BY id ASC';

			this.db.executeSql(sql, [], (result: any)=> 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getClassRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_class WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setClassActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_class SET active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setClassTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_class SET start_time = ?, end_time = ?, roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	initSleepSchedule = (dayNum: number, active: number, startTime: number, endtime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_sleep 
				(day_num, active, start_time, end_time, roll_over) 
			VALUES 
				(?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, active, startTime, endtime, rollOver], (result: any)=> 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getSleepRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_sleep ORDER BY id ASC';

			this.db.executeSql(sql, [], (result: any)=> 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getSleepRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_sleep WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setSleepActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_sleep SET active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setSleepTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_sleep SET start_time = ?, end_time = ?, roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	initEatSchedule = (dayNum: number, breakfastActive: number, breakfastStart: number, breakfastEnd: number, breakfastRollOver: number, lunchActive: number, lunchStart: number, lunchEnd: number, lunchRollOver: number, dinnerActive: number, dinnerStart: number, dinnerEnd: number, dinnerRollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_eat 
				(day_num, breakfast_active, breakfast_start, breakfast_end, breakfast_roll_over, lunch_active, lunch_start, lunch_end, lunch_roll_over, dinner_active, dinner_start, dinner_end, dinner_roll_over) 
			VALUES 
				(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, breakfastActive, breakfastStart, breakfastEnd, breakfastRollOver, lunchActive, lunchStart, lunchEnd, lunchRollOver, dinnerActive, dinnerStart, dinnerEnd, dinnerRollOver], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getEatRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_eat ORDER BY id ASC';

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

	getEatRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_eat WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setEatBreakfastActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET breakfast_active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setEatLunchActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET lunch_active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setEatDinnerActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET dinner_active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setEatBreakfastTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET breakfast_start = ?, breakfast_end = ?, breakfast_roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	setEatLunchTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET lunch_start = ?, lunch_end = ?, lunch_roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	setEatDinnerTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_eat SET dinner_start = ?, dinner_end = ?, dinner_roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	initPrepareSchedule = (dayNum: number, active: number, startTime: number, endtime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_prepare 
				(day_num, active, start_time, end_time, roll_over) 
			VALUES 
				(?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, active, startTime, endtime, rollOver], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getPrepareRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_prepare ORDER BY id ASC';

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

	getPrepareRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_prepare WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setPrepareActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_prepare SET active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setPrepareTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_prepare SET start_time = ?, end_time = ?, roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	delPrepareRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM schedule_prepare WHERE id = ?',
					[id],
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

	initCommuteSchedule = (dayNum: number, active: number, startTime: number, endtime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO schedule_commute 
				(day_num, active, start_time, end_time, roll_over) 
			VALUES 
				(?,?,?,?,?)`;

			this.db.executeSql(sql, [dayNum, active, startTime, endtime, rollOver], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getCommuteRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_commute ORDER BY id ASC';

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

	getCommuteRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = 'SELECT * FROM schedule_commute WHERE id = ?';

			this.db.executeSql(sql, [id], (result: any) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	setCommuteActive = (id: number, active: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_commute SET active = ? WHERE id = ?', [active, id], (tx: any, results: any) => 
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

	setCommuteTimes = (id: number, startTime: number, endTime: number, rollOver: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql('UPDATE schedule_commute SET start_time = ?, end_time = ?, roll_over = ? WHERE id = ?', [startTime, endTime, rollOver, id], (tx: any, results: any) => 
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

	delCommuteRecord = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql
				(
					'DELETE FROM schedule_commute WHERE id = ?',
					[id],
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

    // Truncate tables
    truncWorkSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_WORK);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_WORK, [], (result: unknown) => 
			{
				resolve(result);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncClassSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_CLASS);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_CLASS, [], (result: unknown) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncSleepSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_SLEEP);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_SLEEP, [], (result: unknown) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncEatSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_EAT);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_EAT, [], (result: unknown) => 
			{
				resolve(true);
			},
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncPrepareSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_PREPARE);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_PREPARE,[], (result: unknown) => 
			{
				resolve(true);
			},
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncCommuteSchedule = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_SCHEDULE_COMMUTE);
			this.db.executeSql(this.CREATE_TABLE_SCHEDULE_COMMUTE, [], (result: unknown) =>
			{
				resolve(true);
			},
			(error: any) => 
			{
				reject(error);
			});
		});
    }
}

export default new DbSchedule();