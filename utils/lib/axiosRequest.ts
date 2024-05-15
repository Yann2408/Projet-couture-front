import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface RequestConfig<T> extends AxiosRequestConfig {
  data?: T;
}

interface Response<T> extends AxiosResponse<T> {}

const accessToken = localStorage.getItem('access_token')

async function axiosRequest<T, U = undefined>(config: RequestConfig<U>): Promise<Response<T>> {

  try {
    const response = await axios.request<T>({
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    return response;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erreur Axios : ${error.message}`);
    } else {
      throw new Error('Une erreur inattendue s\'est produite');
    }
  }
}
export default axiosRequest;

// ** exemples **

// async function fetchUsers() {
//     const response = await axiosRequest<User[]>({
//       method: 'GET',
//       url: 'https://api.example.com/users',
//     });
//     return response.data;
//   }
  
//   async function createUser(user: User) {
//     const response = await axiosRequest<User, User>({
//       method: 'POST',
//       url: 'https://api.example.com/users',
//       data: user,
//     });
//     return response.data;
//   }
