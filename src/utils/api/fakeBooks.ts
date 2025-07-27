import { API_BASE_URL,ENDPOINT_FAKE_BOOKS } from '@config/api';

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