import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'https://metroguessr-server.vercel.app/'; 

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Score {
  _id: string;
  username: string;
  points: number;
  city: string;
  createdAt: string;
}

export interface UsernameExistsResponse {
  exists: boolean;
}

// API functions
export const createScore = async (scoreData: { username: string, points: number, city: string }): Promise<Score> => {
  try {
    const response: AxiosResponse<Score> = await api.post('/scores/create', scoreData);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const getScoreById = async (scoreId: string): Promise<Score | null> => {
  try {
    const response: AxiosResponse<{ score: Score }> = await api.get(`/scores/get/${scoreId}`);
    return response.data.score;
  } catch (error) {
    if (error === 404) {
      return null; 
    }
    throw error; 
  }
};

export const getAllScores = async (): Promise<Score[]> => {
  try {
    const response: AxiosResponse<{ scores: Score[] }> = await api.get('/scores/get');
    return response.data.scores;
  } catch (error) {
    throw error;
  }
};

export const getTopScoresByCity = async (city: string): Promise<Score[]> => {
  try {
    const response: AxiosResponse<{ scores: Score[] }> = await api.get('/scores/get');
    const cityScores: Score[] = response.data.scores.filter((score) => score.city === city);
    const sortedCityScores: Score[] = cityScores.sort((a, b) => b.points - a.points).slice(0, 5);
    return sortedCityScores;
  } catch (error) {
    throw error;
  }
};

export const updateScore = async (scoreId: string, scoreData: { username: string, points: number, city: string }): Promise<Score> => {
  try {
    const response: AxiosResponse<Score> = await api.patch(`/scores/update/${scoreId}`, scoreData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteScore = async (scoreId: string): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ score: Score; message: string }> = await api.delete(`/scores/delete/${scoreId}`);
    return { message: response.data.message };
  } catch (error) {
    throw error;
  }
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<UsernameExistsResponse> = await api.get(`/users/check-username/${username}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking username existence:', error);
    throw new Error('Failed to check username existence');
  }
};

export const getAllUsernames = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<{ scores: Score[] }> = await api.get('/scores/get');
    const usernames: string[] = response.data.scores.map((score) => score.username);
    return usernames;
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateScore = async (scoreData: { username: string, points: number, city: string }): Promise<Score> => {
  try {
    const response: AxiosResponse<Score> = await api.post('/scores/createOrUpdate', scoreData);
    return response.data;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the caller
  }
};
