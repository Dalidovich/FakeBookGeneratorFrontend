import { API_BASE_URL,ENDPOINT_FAKE_BOOKS,ENDPOINT_FAKE_COMMENTS } from '@config/api';

interface options {
  language: number;
  AVGLike: number;
  AVGComments: number;
  Seed: number;
}

export const getFakeBooks = async (page: number,options:options): Promise<Response> => {
    const url = new URL(`${API_BASE_URL}${ENDPOINT_FAKE_BOOKS}/${page}`);
    url.searchParams.append('language', options.language.toString());
    url.searchParams.append('AVGLike', options.AVGLike.toString());
    url.searchParams.append('AVGComments',options.AVGComments.toString());
    url.searchParams.append('Seed', options.Seed.toString());

    const response = await fetch(url, {
        method: "GET",
    });

  return response;
};

export const getFakeComments = async (id: number, count:number, language:number): Promise<Response> => {
  
    const url = new URL(`${API_BASE_URL}${ENDPOINT_FAKE_COMMENTS}/${id}`);
    url.searchParams.append('count',count.toString());
    url.searchParams.append('language', language.toString());

    console.log(url.toString())
    const response = await fetch(url, {
        method: "GET",
    });

  return response;
};