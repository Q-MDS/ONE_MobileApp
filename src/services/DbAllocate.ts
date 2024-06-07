import DbSetup from './DbSetup';
import DbHelper from './DbHelper';

class DbAllocate 
{
    db = DbHelper.getDb();
    TABLE_ALLOCATE_PHYSICAL: string = 'allocate_physical';
	TABLE_ALLOCATE_EMOTIONAL: string = 'allocate_emotional';
	TABLE_ALLOCATE_MENTAL: string = 'allocate_mental';
	TABLE_ALLOCATE_SPIRITUAL: string = 'allocate_spiritual';

	CREATE_TABLE_ALLOCATE_PHYSICAL: string = DbSetup.CREATE_TABLE_ALLOCATE_PHYSICAL;
	CREATE_TABLE_ALLOCATE_EMOTIONAL: string = DbSetup.CREATE_TABLE_ALLOCATE_EMOTIONAL;
	CREATE_TABLE_ALLOCATE_MENTAL: string = DbSetup.CREATE_TABLE_ALLOCATE_MENTAL;
	CREATE_TABLE_ALLOCATE_SPIRITUAL: string = DbSetup.CREATE_TABLE_ALLOCATE_SPIRITUAL;

    constructor() {}

	getTotScheduleHours	= () => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql('SELECT COUNT(*) AS count FROM calendar', [], (result: any) => 
			{
				let count = result.rows.item(0).count;

				resolve(count);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	addPhysicalRecord = (activity: string, activityNote: string, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO allocate_physical 
				(activity, activity_note, tot_hours) 
			VALUES 
				(?,?,?)`;

			this.db.executeSql(sql, [activity, activityNote, totHours], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getPhysicalRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql(`SELECT * FROM ${this.TABLE_ALLOCATE_PHYSICAL} ORDER BY id ASC`, [], (result: any) => 
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

	updPhysicalHour	= (id: number, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_PHYSICAL} SET tot_hours = ? WHERE id = ?`, [totHours, id], (tx: any, results: any) => 
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

	addToPhysicalHour = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_PHYSICAL} SET tot_hours = tot_hours + 1 WHERE id = ?`, [id], (tx: any, results: any) => 
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

	updPhysicalNote	= (id: number, note: string) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_PHYSICAL} SET activity_note = ? WHERE id = ?`, [note, id], (tx: any, results: any) => 
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

	delPhysicalRecords = (activityType: number, saId: number) => 
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
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('No records found to delete'));
						}
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}	

	addEmotionalRecord = (activity: string, activityNote: string, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO allocate_emotional 
				(activity, activity_note, tot_hours) 
			VALUES 
				(?,?,?)`;

			this.db.executeSql(sql, [activity, activityNote, totHours], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getEmotionalRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql(`SELECT * FROM ${this.TABLE_ALLOCATE_EMOTIONAL} ORDER BY id ASC`, [], (result: any) => 
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

	updEmotionalHour = (id: number, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_EMOTIONAL} SET tot_hours = ? WHERE id = ?`, [totHours, id], (tx: any, results: any) => 
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

	addToEmotionalHour = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_EMOTIONAL} SET tot_hours = tot_hours + 1 WHERE id = ?`, [id], (tx: any, results: any) => 
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

	updEmotionalNote = (id: number, note: string) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_EMOTIONAL} SET activity_note = ? WHERE id = ?`, [note, id], (tx: any, results: any) => 
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

	delEmotionalRecords = (activityType: number, saId: number) => 
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
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('No records found to delete'));
						}
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	addMentalRecord = (activity: string, activityNote: string, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO allocate_mental 
				(activity, activity_note, tot_hours) 
			VALUES 
				(?,?,?)`;

			this.db.executeSql(sql, [activity, activityNote, totHours], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getMentalRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql(`SELECT * FROM ${this.TABLE_ALLOCATE_MENTAL} ORDER BY id ASC`, [], (result: any) => 
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

	updMentalHour = (id: number, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_MENTAL} SET tot_hours = ? WHERE id = ?`, [totHours, id], (tx: any, results: any) => 
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

	addToMentalHour = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_MENTAL} SET tot_hours = tot_hours + 1 WHERE id = ?`, [id], (tx: any, results: any) => 
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

	updMentalNote = (id: number, note: string) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_MENTAL} SET activity_note = ? WHERE id = ?`, [note, id], (tx: any, results: any) => 
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

	delMentalRecords = (activityType: number, saId: number) => 
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
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('No records found to delete'));
						}
					},
					(error: any) => 
					{
						reject(error);
					}
				);
			});
		});
	}

	addSpiritualRecord = (activity: string, activityNote: string, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO allocate_spiritual  
				(activity, activity_note, tot_hours) 
			VALUES 
				(?,?,?)`;

			this.db.executeSql(sql, [activity, activityNote, totHours], (result: any) => 
			{
				resolve(true);
			}, 
			(error: any) => 
			{
				reject(error);
			});
		});
	}

	getSpiritualRecords = () => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql(`SELECT * FROM ${this.TABLE_ALLOCATE_SPIRITUAL} ORDER BY id ASC`, [], (result: any) => 
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

	updSpiritualHour = (id: number, totHours: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_SPIRITUAL} SET tot_hours = ? WHERE id = ?`, [totHours, id], (tx: any, results: any) => 
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

	addToSpiritualHour = (id: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_SPIRITUAL} SET tot_hours = tot_hours + 1 WHERE id = ?`, [id], (tx: any, results: any) => 
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

	updSpiritualNote = (id: number, note: string) => 
	{
		return new Promise((resolve, reject) => 
		{
			this.db.transaction((tx: any) => 
			{
				tx.executeSql(`UPDATE ${this.TABLE_ALLOCATE_SPIRITUAL} SET activity_note = ? WHERE id = ?`, [note, id], (tx: any, results: any) => 
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

	delSpiritualRecords = (activityType: number, saId: number) => 
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
						if (results.rowsAffected > 0) 
						{
							resolve(results.rowsAffected);
						} 
						else 
						{
							reject(new Error('No records found to delete'));
						}
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
    truncAllocatePhysical = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_PHYSICAL);
			this.db.executeSql(this.CREATE_TABLE_ALLOCATE_PHYSICAL, [], (result: unknown) => 
			{
				resolve(true);
			},
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncAllocateEmotional = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_EMOTIONAL);
			this.db.executeSql(this.CREATE_TABLE_ALLOCATE_EMOTIONAL, [], (result: unknown) => 
			{
				resolve(true)
			},
			(error: any) => 
			{
				reject(error);
			});
		});
	}
    truncAllocateMental = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_MENTAL);
			this.db.executeSql(this.CREATE_TABLE_ALLOCATE_MENTAL, [], (result: unknown) => 
			{
				resolve(true);
			},
			(error: any) => 
			{
				reject(error);
			});
		});
    }
    truncAllocateSpiritual = () => 
    {
		return new Promise((resolve, reject) => 
		{
			this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ALLOCATE_SPIRITUAL);
			this.db.executeSql(this.CREATE_TABLE_ALLOCATE_SPIRITUAL, [], (result: unknown) => 
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

export default new DbAllocate();