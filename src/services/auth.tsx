import api from './api';
import { AxiosError } from 'axios';

export const register = async (data: any) =>
{
	try 
	{
		const response = await api.post('/api/register/', data);
	
		if (response.status === 200) 
		{
			return response.data;
		} 
		else 
		{
			throw new Error('Register failed');
		}
	} 
	catch (error) 
	{
		console.error(error);
		throw error;
	}
};

export const login = async (credOne: string, credTwo: string) => 
{
	try 
	{
		const response = await api.post('api/auth_controller/login', {credOne, credTwo});
	
		if (response.status === 200) 
		{
			return response.data;
		} 
	} 
	catch (error) 
	{
		return error
	}
};

export const changeCreds = async (credOne: string, credTwo: string, credNew: string) => 
{
	try 
	{
		const response = await api.post('api/auth_controller/change_password', {credOne, credTwo, credNew});
	
		if (response.status === 200) 
		{
			return response.data;
		} 
	} 
	catch (error) 
	{
		return error
	}
};