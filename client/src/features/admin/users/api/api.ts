import { mapDomainToUserRequest, mapUserToDomain } from './mapper';

import { User } from '../models/user';
import { UserResponse } from './types';
import axios from 'axios';

export const getUsers = async () => {
  const { data } = await axios.get<UserResponse[]>('/api/admin/users');
  return data.map((user) => mapUserToDomain(user));
};

export const addUser = async (user: User) => {
  const userRequest = mapDomainToUserRequest(user);
  const { data } = await axios.post<UserResponse>('/api/admin/users', userRequest);
  return mapUserToDomain(data);
};

export const editUser = async (user: User) => {
  const userRequest = mapDomainToUserRequest(user);
  const { data } = await axios.put<UserResponse>(`/api/admin/users/${user.id}`, userRequest);
  return mapUserToDomain(data);
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`/api/admin/users/${userId}`);
};
